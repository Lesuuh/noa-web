type kpiCard = {
  label: string;
  value: number | string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

const KpiCard = ({ kpiData }: { kpiData: kpiCard[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpiData?.map((kpi) => (
        <div
          key={kpi.label}
          // Added subtle hover shadow
          className={`${kpi.bgColor} border ${kpi.borderColor} rounded-xl p-4 sm:px-6 py-5 transition-all hover:scale-[1.02] hover:shadow-md`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`${kpi.textColor} text-2xl sm:text-3xl font-bold mt-2`}
              >
                {kpi.value}
              </p>
              <p className="text-slate-500 text-xs font-medium uppercase">
                {kpi.label}
              </p>
            </div>
            <div
              className={`bg-white p-2 sm:p-3 rounded-lg border ${kpi.borderColor}`}
            >
              <kpi.icon className={`${kpi.textColor} w-5 h-5 sm:w-6 sm:h-6`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCard;
