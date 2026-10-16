# Final Edition — QA checklist

Automated functional checks completed in Chromium:

- [x] All 10 chapters load and complete in sequence using simulated game-state input
- [x] Hearts, keys, umbrella, star fragments, companion switches, and dog rescue
- [x] Bridge collision geometry after activating each new bridge
- [x] Hidden letters and secret-ending eligibility
- [x] Home decor, in-game currency, and matching outfits
- [x] Final chapter and ending shown
- [x] Save export / import and validation against a generated JSON save
- [x] Legacy V3 save migration logic (using simulated browser storage)
- [x] Desktop keyboard and mobile touch movement
- [x] No uncaught JavaScript exceptions in scripted paths
- [x] English text checks in HTML, JavaScript, and CSS
- [x] Relative URLs point to files included in the static site

Before sharing with your girlfriend, publish on GitHub Pages and smoke-test the public URL:

- [ ] Homepage loads on a phone and laptop
- [ ] Jump / movement works on your own devices
- [ ] Refresh retains game progress on GitHub Pages
- [ ] Export and Import Save work if transferring an old save

Tests used scripted positioning for collectibles and puzzles, and therefore do not prove every manual jumping route can be finished on every device. These are functional tests, not a guarantee of bug-free play.
