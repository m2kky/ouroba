fetch('https://oroubafoods.com/static/js/main.349cc576.js')
  .then(r => r.text())
  .then(t => {
    const matches = t.match(/https?:\/\/[^\s"'`]+/g) || [];
    const unique = Array.from(new Set(matches));
    console.log(unique.filter(u => u.includes('api') || u.includes('backend') || u.includes('orouba')));
  });
