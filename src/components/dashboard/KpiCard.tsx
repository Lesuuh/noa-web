type kpiCard = {
  label: string;
  value: number | string;
  icon: React.ElementType;
  textColor: string; // Used for icon and status accent
};

const KpiCard = ({ kpiData }: { kpiData: kpiCard[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData?.map((kpi) => (
        <div
          key={kpi.label}
          className="group bg-white border border-slate-200 rounded-[2rem] p-6 transition-all hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-200"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div
                className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors`}
              >
                <kpi.icon className={`${kpi.textColor} w-6 h-6`} />
              </div>
              {/* Optional: Add a small trend indicator here if needed */}
            </div>

            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                {kpi.label}
              </p>
              <p className="text-slate-900 text-3xl font-black tracking-tight">
                {kpi.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCard;
