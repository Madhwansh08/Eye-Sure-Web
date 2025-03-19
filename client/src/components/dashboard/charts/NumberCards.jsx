import React from "react";
import { FiUser } from "react-icons/fi";
import { BsLungs } from "react-icons/bs";
import { MdPriorityHigh, MdOutlineCheck } from "react-icons/md";

const NumberCards = ({ patientCount, drCount, glaucomaCount, armdCount }) => {
  return (
    <div className="p-4">
      <p className="text-xl font-semibold mb-2 text-[#030811]">Metrics</p>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
          title="Patients"
          subtitle="Total Patients"
          number={patientCount}
          Icon={FiUser}
        />
        <Card
          title="DR Reports"
          subtitle="Total DR Reports"
          number={drCount}
          Icon={BsLungs}
        />
        <Card
          title="Glaucoma Reports"
          subtitle="Total Glaucoma Reports"
          number={glaucomaCount}
          Icon={MdPriorityHigh}
        />
        <Card
          title="ARMD Reports"
          subtitle="Total ARMD Reports"
          number={armdCount}
          Icon={MdOutlineCheck}
        />
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, number }) => {
  return (
    <button className="w-full p-4 rounded border-[1px] border-gray-800 dark:border-slate-300 relative overflow-hidden group bg-black dark:bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C90BF] to-[#387AA4] translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-[rgb(100,176,179)] group-hover:rotate-12 transition-transform duration-300" />
      <div className="relative z-10">
        <Icon className="mb-2 text-2xl text-[#387AA4] group-hover:text-white transition-colors duration-300" />
        <h3 className="font-medium text-lg text-[#fdfdfd] dark:text-[#030811] group-hover:text-white duration-300">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 group-hover:text-[rgb(100,176,179)] duration-300">
            {subtitle}
          </p>
          <span className="text-3xl font-bold text-[#387AA4] group-hover:text-white transition-colors duration-300">
            {number}
          </span>
        </div>
      </div>
    </button>
  );
};

export default NumberCards;