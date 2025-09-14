const DashboardCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  const changeIcon = changeType === 'positive' ? '↗' : '↘';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {icon && (
              <div className={`p-2 rounded-lg ${colorClasses[color]} text-white`}>
                {icon}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${changeColor}`}>
              <span className="text-sm font-medium">
                {changeIcon} {change}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
