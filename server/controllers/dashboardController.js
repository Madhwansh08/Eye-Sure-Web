const Patient=require('../models/patient')
const Doctor=require('../models/doctor')
const Report=require('../models/report')

exports.getDashboardData = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    // Fetch total patients for this doctor
    const totalPatients = await Patient.countDocuments({ doctor: doctorId });

    // Fetch all reports for the patients associated with the doctor
    const patientIds = await Patient.find({ doctor: doctorId }).distinct('_id');

    const totalReports = await Report.countDocuments({ patientId: { $in: patientIds } });
    const totalDRReports = await Report.countDocuments({ 
      patientId: { $in: patientIds }, 
      analysisType: 'DR' 
    });
    const totalGlaucomaReports = await Report.countDocuments({ 
      patientId: { $in: patientIds }, 
      analysisType: 'Glaucoma' 
    });
    const totalArmdReports = await Report.countDocuments({ 
      patientId: { $in: patientIds }, 
      analysisType: 'Armd' 
    });

    // Response
    return res.status(200).json({
      totalPatients,
      totalReports,
      totalDRReports,
      totalGlaucomaReports,
      totalArmdReports
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getDRDashboardData = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const patientIds = await Patient.find({ doctor: doctorId }).distinct('_id');
    const { eye = "both" } = req.query;

    const aggregationPipeline = [
      { 
        $match: { patientId: { $in: patientIds }, analysisType: "DR" } 
      },
      {
        $facet: {
          leftFundus: [
            {
              $group: {
                _id: {
                  day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  status: "$leftFundusPrediction.primary_classification.class_name",
                  eye: { $literal: "left" }
                },
                totalCount: { $sum: 1 }
              }
            }
          ],
          rightFundus: [
            {
              $group: {
                _id: {
                  day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  status: "$rightFundusPrediction.primary_classification.class_name",
                  eye: { $literal: "right" }
                },
                totalCount: { $sum: 1 }
              }
            }
          ]
        }
      }
    ];

    const result = await Report.aggregate(aggregationPipeline);
    const leftData = result[0].leftFundus;
    const rightData = result[0].rightFundus;

    const formattedData = {};
    const combinedData = eye === "left" ? leftData : eye === "right" ? rightData : [...leftData, ...rightData];

    combinedData.forEach((item) => {
      const { day, status, eye } = item._id;
      if (status !== "REF" && status !== "NON-REF") {
        console.warn(`Unexpected status found: ${status}`);
        return;
      }

      if (!formattedData[day]) {
        formattedData[day] = { left: { REF: 0, 'NON-REF': 0 }, right: { REF: 0, 'NON-REF': 0 } };
      }

      formattedData[day][eye][status] += item.totalCount;
    });

    return res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Error in getDRDashboardData", error);
    return res.status(500).json({ message: "Server error" });
  }
};


  

  exports.getGlaucomaDashboardData = async (req, res) => {
    try {
      const doctorId = req.doctor.id;
      const patientIds = await Patient.find({ doctor: doctorId }).distinct('_id');
      const { eye = "both" } = req.query;
  
      // Aggregation Pipeline
      const aggregationPipeline = [
        {
          $match: { patientId: { $in: patientIds }, analysisType: "Glaucoma" }
        },
        {
          $facet: {
            leftEye: [
              {
                $group: {
                  _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    status: "$contorLeftGlaucomaStatus",
                    eye: { $literal: "left" }
                  },
                  totalCount: { $sum: 1 },
                }
              }
            ],
            rightEye: [
              {
                $group: {
                  _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    status: "$contorRightGlaucomaStatus",
                    eye: { $literal: "right" }
                  },
                  totalCount: { $sum: 1 },
                }
              }
            ]
          }
        }
      ];
  
      let result = await Report.aggregate(aggregationPipeline);
      let leftData = result[0].leftEye;
      let rightData = result[0].rightEye;
  
      const structuredResponse = {};
      [leftData, rightData].forEach((data) => {
        data.forEach((item) => {
          const { day, status, eye } = item._id;
          if (!structuredResponse[day]) {
            structuredResponse[day] = { left: {}, right: {} };
          }
          if (!structuredResponse[day][eye][status]) {
            structuredResponse[day][eye][status] = 0;
          }
          structuredResponse[day][eye][status] += item.totalCount;
        });
      });
  
      return res.status(200).json({ data: structuredResponse });
    } catch (error) {
      console.error("Error in getGlaucomaDashboardData", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  


exports.getArmdDashboardData = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const patientIds = await Patient.find({ doctor: doctorId }).distinct('_id');
    
    const aggregationPipeline = [
      { 
        $match: { 
          patientId: { $in: patientIds }, 
          analysisType: "Armd" 
        } 
      },
      {
        $facet: {
          leftEye: [
            {
              $group: {
                _id: {
                  day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  status: {
                    $cond: [
                      { $eq: ["$leftFundusArmdPrediction", "1"] },
                      "ARMD Predicted",
                      "No ARMD"
                    ]
                  },
                },
                totalCount: { $sum: 1 },
              }
            }
          ],
          rightEye: [
            {
              $group: {
                _id: {
                  day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  status: {
                    $cond: [
                      { $eq: ["$rightFundusArmdPrediction", "1"] },
                      "ARMD Predicted",
                      "No ARMD"
                    ]
                  },
                },
                totalCount: { $sum: 1 },
              }
            }
          ]
        }
      }
    ];

    const result = await Report.aggregate(aggregationPipeline);
    const formattedData = {};

    // Format Left Eye Data
    result[0].leftEye.forEach(({ _id, totalCount }) => {
      const { day, status } = _id;
      if (!formattedData[day]) {
        formattedData[day] = { left: { ARMDPredicted: 0, NoARMD: 0 }, right: { ARMDPredicted: 0, NoARMD: 0 } };
      }
      formattedData[day].left[status === "ARMD Predicted" ? "ARMDPredicted" : "NoARMD"] += totalCount;
    });

    // Format Right Eye Data
    result[0].rightEye.forEach(({ _id, totalCount }) => {
      const { day, status } = _id;
      if (!formattedData[day]) {
        formattedData[day] = { left: { ARMDPredicted: 0, NoARMD: 0 }, right: { ARMDPredicted: 0, NoARMD: 0 } };
      }
      formattedData[day].right[status === "ARMD Predicted" ? "ARMDPredicted" : "NoARMD"] += totalCount;
    });

    return res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Error in getArmdDashboardData", error);
    return res.status(500).json({ message: "Server error" });
  }
};

