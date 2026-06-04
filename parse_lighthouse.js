const fs = require('fs');

try {
  const demo = JSON.parse(fs.readFileSync('demo.json', 'utf8'));
  const prod = JSON.parse(fs.readFileSync('prod.json', 'utf8'));

  function getScore(json, category) {
    return json.categories[category] ? Math.round(json.categories[category].score * 100) : 'N/A';
  }

  function getMetric(json, metricId) {
    return json.audits[metricId] ? json.audits[metricId].displayValue : 'N/A';
  }

  console.log("=== PERFORMANCE COMPARISON ===");
  console.log("METRIC                | NEW (Demo) | OLD (Prod)");
  console.log("------------------------------------------------");
  console.log(`Performance Score     | ${getScore(demo, 'performance')} | ${getScore(prod, 'performance')}`);
  console.log(`Accessibility Score   | ${getScore(demo, 'accessibility')} | ${getScore(prod, 'accessibility')}`);
  console.log(`Best Practices Score  | ${getScore(demo, 'best-practices')} | ${getScore(prod, 'best-practices')}`);
  console.log(`SEO Score             | ${getScore(demo, 'seo')} | ${getScore(prod, 'seo')}`);
  console.log("------------------------------------------------");
  console.log(`First Contentful Paint| ${getMetric(demo, 'first-contentful-paint')} | ${getMetric(prod, 'first-contentful-paint')}`);
  console.log(`Speed Index           | ${getMetric(demo, 'speed-index')} | ${getMetric(prod, 'speed-index')}`);
  console.log(`Largest Cont. Paint   | ${getMetric(demo, 'largest-contentful-paint')} | ${getMetric(prod, 'largest-contentful-paint')}`);
  console.log(`Total Blocking Time   | ${getMetric(demo, 'total-blocking-time')} | ${getMetric(prod, 'total-blocking-time')}`);
  console.log(`Cumulative Layout Shift| ${getMetric(demo, 'cumulative-layout-shift')} | ${getMetric(prod, 'cumulative-layout-shift')}`);
} catch(e) {
  console.log("Waiting for files...", e.message);
}
