"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}

import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Bar, LinePath } from "@visx/shape"
import { Text } from "@visx/text"
import { Pie } from "@visx/shape"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { localPoint } from "@visx/event"
import { LegendOrdinal } from "@visx/legend"

// Bar Chart Component
export function BarChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value) => value.toString(),
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  yAxisWidth = 40,
  height = 300,
}) {
  const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }
  const [width, setWidth] = React.useState(0)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Scales
  const xScale = scaleBand({
    domain: data.map((d) => d[index]),
    range: [0, xMax],
    padding: 0.2,
  })

  const maxValue = Math.max(...data.flatMap((d) => categories.map((c) => d[c] || 0)))

  const yScale = scaleLinear({
    domain: [0, maxValue * 1.1], // Add 10% padding
    range: [yMax, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal({
    domain: categories,
    range: colors.map((color) => `var(--${color})`),
  })

  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  }

  const handleMouseOver = (event, datum, category) => {
    const coords = localPoint(event.target.ownerSVGElement, event)
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: {
        label: datum[index],
        category,
        value: datum[category],
      },
    })
  }

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      {showLegend && categories.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
        </div>
      )}
      <svg width={width} height={height} ref={tooltipContainerRef}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke="var(--border)"
            strokeOpacity={0.4}
            numTicksRows={5}
          />
          {categories.map((category, i) => (
            <Group key={`bars-${category}`}>
              {data.map((d, j) => {
                const barWidth = xScale.bandwidth() / categories.length
                const barX = xScale(d[index]) + i * barWidth
                const barY = yScale(d[category] || 0)
                const barHeight = yMax - barY

                return (
                  <Bar
                    key={`bar-${category}-${j}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={colorScale(category)}
                    opacity={0.8}
                    onMouseOver={(event) => handleMouseOver(event, d, category)}
                    onMouseOut={hideTooltip}
                  />
                )
              })}
            </Group>
          ))}
          {showYAxis && (
            <AxisLeft
              scale={yScale}
              numTicks={5}
              tickFormat={(value) => valueFormatter(value)}
              stroke="var(--border)"
              tickStroke="var(--border)"
              tickLabelProps={() => ({
                fill: "var(--muted-foreground)",
                fontSize: 10,
                textAnchor: "end",
                dy: "0.33em",
              })}
            />
          )}
          {showXAxis && (
            <AxisBottom
              top={yMax}
              scale={xScale}
              stroke="var(--border)"
              tickStroke="var(--border)"
              tickLabelProps={() => ({
                fill: "var(--muted-foreground)",
                fontSize: 10,
                textAnchor: "middle",
                dy: "0.33em",
              })}
            />
          )}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>
            {tooltipData.category}: {valueFormatter(tooltipData.value)}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

// Line Chart Component
export function LineChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value) => value.toString(),
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  yAxisWidth = 40,
  height = 300,
}) {
  const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }
  const [width, setWidth] = React.useState(0)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // Scales
  const xScale = scaleBand({
    domain: data.map((d) => d[index]),
    range: [0, xMax],
  })

  const maxValue = Math.max(...data.flatMap((d) => categories.map((c) => d[c] || 0)))

  const yScale = scaleLinear({
    domain: [0, maxValue * 1.1], // Add 10% padding
    range: [yMax, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal({
    domain: categories,
    range: colors.map((color) => `var(--${color})`),
  })

  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  }

  const handleMouseOver = (event, datum, category) => {
    const coords = localPoint(event.target.ownerSVGElement, event)
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: {
        label: datum[index],
        category,
        value: datum[category],
      },
    })
  }

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      {showLegend && categories.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
        </div>
      )}
      <svg width={width} height={height} ref={tooltipContainerRef}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke="var(--border)"
            strokeOpacity={0.4}
            numTicksRows={5}
          />
          {categories.map((category, i) => {
            const lineData = data.map((d) => ({
              x: xScale(d[index]) + xScale.bandwidth() / 2,
              y: yScale(d[category] || 0),
              value: d[category] || 0,
            }))

            return (
              <Group key={`line-${category}`}>
                <LinePath
                  data={lineData}
                  x={(d) => d.x}
                  y={(d) => d.y}
                  stroke={colorScale(category)}
                  strokeWidth={2}
                  curve="monotoneX"
                />
                {lineData.map((d, j) => (
                  <circle
                    key={`dot-${category}-${j}`}
                    cx={d.x}
                    cy={d.y}
                    r={4}
                    fill={colorScale(category)}
                    stroke="white"
                    strokeWidth={1.5}
                    onMouseOver={(event) => handleMouseOver(event, data[j], category)}
                    onMouseOut={hideTooltip}
                  />
                ))}
              </Group>
            )
          })}
          {showYAxis && (
            <AxisLeft
              scale={yScale}
              numTicks={5}
              tickFormat={(value) => valueFormatter(value)}
              stroke="var(--border)"
              tickStroke="var(--border)"
              tickLabelProps={() => ({
                fill: "var(--muted-foreground)",
                fontSize: 10,
                textAnchor: "end",
                dy: "0.33em",
              })}
            />
          )}
          {showXAxis && (
            <AxisBottom
              top={yMax}
              scale={xScale}
              stroke="var(--border)"
              tickStroke="var(--border)"
              tickLabelProps={() => ({
                fill: "var(--muted-foreground)",
                fontSize: 10,
                textAnchor: "middle",
                dy: "0.33em",
              })}
            />
          )}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>
            {tooltipData.category}: {valueFormatter(tooltipData.value)}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

// Pie Chart Component
export function PieChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value) => value.toString(),
  height = 300,
}) {
  const [width, setWidth] = React.useState(0)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const category = categories[0]
  const radius = Math.min(width, height) / 2
  const centerX = width / 2
  const centerY = height / 2

  const colorScale = scaleOrdinal({
    domain: data.map((d) => d[index]),
    range: colors.map((color) => `var(--${color})`),
  })

  const pie = React.useMemo(
    () => ({
      data,
      value: (d) => d[category],
      label: (d) => d[index],
    }),
    [data, category, index],
  )

  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  }

  const handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event)
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: {
        label: datum.data[index],
        value: datum.data[category],
      },
    })
  }

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
      </div>
      <svg width={width} height={height} ref={tooltipContainerRef}>
        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={(d) => d[category]}
            outerRadius={radius - 40}
            innerRadius={radius / 3}
            cornerRadius={3}
            padAngle={0.005}
          >
            {(pie) => {
              return pie.arcs.map((arc, i) => {
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
                const arcPath = pie.path(arc)
                const arcFill = colorScale(arc.data[index])

                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={arcPath}
                      fill={arcFill}
                      onMouseOver={(event) => handleMouseOver(event, arc)}
                      onMouseOut={hideTooltip}
                    />
                    {hasSpaceForLabel && (
                      <Text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fill="white"
                        fontSize={12}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {arc.data[index]}
                      </Text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>{valueFormatter(tooltipData.value)}</div>
        </TooltipInPortal>
      )}
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }

