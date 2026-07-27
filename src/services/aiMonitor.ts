// src/services/aiMonitor.ts

import { LogMetric } from '../types/astrology';

const metricsHistory: LogMetric[] = [];

/**
 * Enterprise Monitoring & Telemetry Service.
 * Logs response times, server statuses, and active data providers (Primary vs Secondary vs Fallback).
 */
export const aiMonitor = {
  /**
   * Log a new API transaction metric.
   */
  logTransaction(metric: LogMetric): void {
    metricsHistory.push(metric);
    
    // Maintain a rotating memory buffer of the last 1000 logs
    if (metricsHistory.length > 1000) {
      metricsHistory.shift();
    }

    const providerEmoji = 
      metric.provider === 'primary' ? '🥇' : 
      metric.provider === 'secondary' ? '🥈' : '🥉 Fallback';

    // Output formatted enterprise monitoring logs to server console
    console.log(
      `[AI-MONITOR] [${new Date(metric.timestamp).toISOString()}] ` +
      `Endpoint: ${metric.endpoint} | ` +
      `Latency: ${metric.latencyMs}ms | ` +
      `Status: ${metric.status} | ` +
      `Provider: ${providerEmoji} ${metric.provider.toUpperCase()} | ` +
      (metric.tokensUsed ? `Tokens: ${metric.tokensUsed} | ` : '') +
      (metric.errorMessage ? `Error: "${metric.errorMessage}"` : 'Success ✅')
    );
  },

  /**
   * Returns overall system health statistics based on rotating telemetry.
   */
  getHealthStats() {
    if (metricsHistory.length === 0) {
      return { status: 'healthy', totalRequests: 0, averageLatencyMs: 0, errorRate: 0 };
    }

    const total = metricsHistory.length;
    const errors = metricsHistory.filter(m => m.status >= 400).length;
    const avgLatency = metricsHistory.reduce((acc, m) => acc + m.latencyMs, 0) / total;

    return {
      status: errors / total > 0.05 ? 'degraded' : 'healthy',
      totalRequests: total,
      averageLatencyMs: Math.round(avgLatency),
      errorRate: parseFloat(((errors / total) * 100).toFixed(2)),
      providerShare: {
        primary: metricsHistory.filter(m => m.provider === 'primary').length,
        secondary: metricsHistory.filter(m => m.provider === 'secondary').length,
        fallback: metricsHistory.filter(m => m.provider === 'local_fallback').length,
      }
    };
  }
};
