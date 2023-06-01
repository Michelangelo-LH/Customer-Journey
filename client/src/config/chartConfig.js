// config/chartConfig.js
import { Chart, Tooltip, LinearScale, PointElement, BubbleController, CategoryScale, LineElement } from 'chart.js';

export const registerChartComponents = () => {
  Chart.register(Tooltip, LinearScale, PointElement, BubbleController, CategoryScale, LineElement);
};


