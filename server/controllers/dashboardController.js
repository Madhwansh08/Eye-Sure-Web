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
      analysisType: 'ARMD' 
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
      const { eye = "both" } = req.query; // Default to both eyes
  
      // Aggregation Pipeline with separate facets and adding an "eye" field.
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
                    fundus: "$leftFundusPrediction.predictions.primary_classification.class_name",
                    eye: { $literal: "left" }  // mark left reports
                  },
                  totalCount: { $sum: 1 },
                }
              }
            ],
            rightFundus: [
              {
                $group: {
                  _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    fundus: "$rightFundusPrediction.predictions.primary_classification.class_name",
                    eye: { $literal: "right" } // mark right reports
                  },
                  totalCount: { $sum: 1 },
                }
              }
            ]
          }
        }
      ];
  
      let result = await Report.aggregate(aggregationPipeline);
      let leftData = result[0].leftFundus;
      let rightData = result[0].rightFundus;
      let filteredData;
  
      if (eye === "left") {
        filteredData = leftData;
      } else if (eye === "right") {
        filteredData = rightData;
      } else {
        filteredData = [...leftData, ...rightData]; // both eyes
      }
  
      return res.status(200).json({ data: filteredData });
    } catch (error) {
      console.error("Error in getDRDashboardData", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  


  