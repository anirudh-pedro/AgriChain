// src/components/UI/Charts.jsx
import React, { useState, useEffect, useRef } from 'react';

// Chart utilities
const formatValue = (value, type = 'number') => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  if (type === 'currency') {
    return `₹${value.toLocaleString()}`;
  }
  if (type === 'percentage') {
    return `${value}%`;
  }
  return value.toLocaleString();
};

const generateColor = (index, opacity = 1) => {
  const colors = [
    `rgba(34, 197, 94, ${opacity})`,   // green
    `rgba(59, 130, 246, ${opacity})`,  // blue  
    `rgba(245, 158, 11, ${opacity})`,  // amber
    `rgba(239, 68, 68, ${opacity})`,   // red
    `rgba(139, 92, 246, ${opacity})`,  // violet
    `rgba(236, 72, 153, ${opacity})`,  // pink
    `rgba(20, 184, 166, ${opacity})`,  // teal
    `rgba(251, 146, 60, ${opacity})`   // orange
  ];
  return colors[index % colors.length];
};

// Line Chart Component
export const LineChart = ({
  data = [],
  width = 400,
  height = 300,
  showGrid = true,
  showDots = true,
  animated = true,
  className = '',
  xKey = 'x',
  yKey = 'y',
  strokeWidth = 2,
  formatType = 'number'
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) return null;

  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xValues = data.map(d => d[xKey]);
  const yValues = data.map(d => d[yKey] || 0);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;

  const points = data.map((d, i) => ({
    x: margin.left + (i / (data.length - 1)) * chartWidth,
    y: margin.top + ((maxY - (d[yKey] || 0)) / yRange) * chartHeight,
    value: d[yKey] || 0,
    label: d[xKey] || 'N/A'
  }));

  const pathData = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const animatedPathData = points
    .slice(0, Math.ceil(points.length * animationProgress))
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {/* Vertical grid lines */}
            {data.map((_, i) => (
              <line
                key={`v-grid-${i}`}
                x1={margin.left + (i / (data.length - 1)) * chartWidth}
                y1={margin.top}
                x2={margin.left + (i / (data.length - 1)) * chartWidth}
                y2={margin.top + chartHeight}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`h-grid-${i}`}
                x1={margin.left}
                y1={margin.top + ratio * chartHeight}
                x2={margin.left + chartWidth}
                y2={margin.top + ratio * chartHeight}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Line path */}
        <path
          d={animatedPathData}
          fill="none"
          stroke={generateColor(0)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Dots */}
        {showDots && points.slice(0, Math.ceil(points.length * animationProgress)).map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={generateColor(0)}
            className="hover:r-6 transition-all duration-200 cursor-pointer"
            style={{
              animationDelay: `${i * 50}ms`,
              transform: animated ? 'scale(0)' : 'scale(1)',
              animation: animated ? 'scale-in 0.3s ease-out forwards' : 'none'
            }}
          >
            <title>{`${point.label}: ${formatValue(point.value, formatType)}`}</title>
          </circle>
        ))}

        {/* X-axis labels */}
        {xValues.map((label, i) => (
          <text
            key={i}
            x={margin.left + (i / (data.length - 1)) * chartWidth}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {label}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = minY + (1 - ratio) * yRange;
          return (
            <text
              key={i}
              x={margin.left - 10}
              y={margin.top + ratio * chartHeight}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {formatValue(value, formatType)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({
  data = [],
  width = 400,
  height = 300,
  showGrid = true,
  animated = true,
  className = '',
  xKey = 'label',
  yKey = 'value',
  formatType = 'number',
  colorScheme = 'green'
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) return null;

  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...data.map(d => d[yKey] || 0));
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`h-grid-${i}`}
                x1={margin.left}
                y1={margin.top + ratio * chartHeight}
                x2={margin.left + chartWidth}
                y2={margin.top + ratio * chartHeight}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Bars */}
        {data.map((item, i) => {
          const barHeight = ((item[yKey] || 0) / maxValue) * chartHeight * animationProgress;
          const x = margin.left + i * (barWidth + barSpacing) + barSpacing / 2;
          const y = margin.top + chartHeight - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={generateColor(i, 0.8)}
                className="hover:opacity-90 transition-all duration-200 cursor-pointer"
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              >
                <title>{`${item[xKey] || 'N/A'}: ${formatValue(item[yKey], formatType)}`}</title>
              </rect>
              
              {/* Value labels on top of bars */}
              {barHeight > 20 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                >
                  {formatValue(item[yKey], formatType)}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((item, i) => (
          <text
            key={i}
            x={margin.left + i * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2}
            y={height - 30}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {item[xKey]}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = ratio * maxValue;
          return (
            <text
              key={i}
              x={margin.left - 10}
              y={margin.top + (1 - ratio) * chartHeight}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {formatValue(value, formatType)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Pie Chart Component
export const PieChart = ({
  data = [],
  width = 300,
  height = 300,
  showLabels = true,
  showLegend = true,
  animated = true,
  className = '',
  valueKey = 'value',
  labelKey = 'label',
  formatType = 'number'
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) return null;

  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  
  let currentAngle = -Math.PI / 2; // Start from top
  const slices = data.map((item, i) => {
    const angle = (item[valueKey] / total) * 2 * Math.PI * animationProgress;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArc = angle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // Label position
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    
    currentAngle = endAngle;
    
    return {
      pathData,
      color: generateColor(i, 0.8),
      percentage: ((item[valueKey] / total) * 100).toFixed(1),
      value: item[valueKey],
      label: item[labelKey],
      labelX,
      labelY,
      angle
    };
  });

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height}>
        {/* Pie slices */}
        {slices.map((slice, i) => (
          <g key={i}>
            <path
              d={slice.pathData}
              fill={slice.color}
              className="hover:opacity-80 transition-all duration-200 cursor-pointer"
              style={{
                animationDelay: `${i * 100}ms`
              }}
            >
              <title>{`${slice.label}: ${formatValue(slice.value, formatType)} (${slice.percentage}%)`}</title>
            </path>
            
            {/* Labels */}
            {showLabels && slice.angle > 0.3 && (
              <text
                x={slice.labelX}
                y={slice.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-white font-medium"
              >
                {slice.percentage}%
              </text>
            )}
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: generateColor(i, 0.8) }}
              />
              <span className="text-sm text-gray-700 truncate">
                {item[labelKey]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Donut Chart Component  
export const DonutChart = ({
  data = [],
  width = 300,
  height = 300,
  innerRadius = 0.5,
  centerContent,
  ...props
}) => {
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`relative ${props.className}`}>
      <PieChart {...props} showLabels={false} />
      
      {/* Center content */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${radius * innerRadius * 2}px`,
          height: `${radius * innerRadius * 2}px`
        }}
      >
        {centerContent || (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(total, props.formatType)}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Area Chart Component
export const AreaChart = ({
  data = [],
  width = 400,
  height = 300,
  showGrid = true,
  animated = true,
  className = '',
  xKey = 'x',
  yKey = 'y',
  formatType = 'number',
  gradientId = 'area-gradient'
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) return null;

  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const yValues = data.map(d => d[yKey]);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;

  const points = data.map((d, i) => ({
    x: margin.left + (i / (data.length - 1)) * chartWidth,
    y: margin.top + ((maxY - d[yKey]) / yRange) * chartHeight,
    value: d[yKey],
    label: d[xKey]
  }));

  const pathData = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${pathData} L ${points[points.length - 1].x} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`;

  const animatedPoints = points.slice(0, Math.ceil(points.length * animationProgress));
  const animatedAreaPath = animatedPoints.length > 1 
    ? `${animatedPoints.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} L ${animatedPoints[animatedPoints.length - 1].x} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`
    : '';

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={generateColor(0, 0.3)} />
            <stop offset="100%" stopColor={generateColor(0, 0.1)} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {data.map((_, i) => (
              <line
                key={`v-grid-${i}`}
                x1={margin.left + (i / (data.length - 1)) * chartWidth}
                y1={margin.top}
                x2={margin.left + (i / (data.length - 1)) * chartWidth}
                y2={margin.top + chartHeight}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`h-grid-${i}`}
                x1={margin.left}
                y1={margin.top + ratio * chartHeight}
                x2={margin.left + chartWidth}
                y2={margin.top + ratio * chartHeight}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Area fill */}
        <path
          d={animatedAreaPath}
          fill={`url(#${gradientId})`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Line */}
        <path
          d={animatedPoints.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
          fill="none"
          stroke={generateColor(0)}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Axes and labels */}
        {data.map((item, i) => (
          <text
            key={i}
            x={margin.left + (i / (data.length - 1)) * chartWidth}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {item[xKey]}
          </text>
        ))}

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = minY + (1 - ratio) * yRange;
          return (
            <text
              key={i}
              x={margin.left - 10}
              y={margin.top + ratio * chartHeight}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {formatValue(value, formatType)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default {
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  AreaChart
};