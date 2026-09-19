import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist', 'fight-simulator.html');
const tmp = path.join(root, '.gh-pages-tmp');

if (!existsSync(dist)) {
  console.error('dist/fight-simulator.html 이 없습니다. 먼저 npm run build:standalone 을 실행하세요.');
  process.exit(1);
}

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', shell: true, ...opts });
const tryRun = (cmd, opts = {}) => {
  try { execSync(cmd, { stdio: 'ignore', shell: true, ...opts }); return true; } catch { return false; }
};

if (!tryRun('git rev-parse --verify gh-pages')) {
  run('git branch gh-pages');
}
tryRun(`git worktree remove --force "${tmp}"`);
rmSync(tmp, { recursive: true, force: true });
run(`git worktree add "${tmp}" gh-pages`);

tryRun('git rm -rf -q .', { cwd: tmp });
cpSync(dist, path.join(tmp, 'index.html'));
writeFileSync(path.join(tmp, '.nojekyll'), '');
tryRun('git add -A', { cwd: tmp });
tryRun('git commit -q -m "deploy: fight-simulator single-file"', { cwd: tmp });
tryRun(`git push -u origin gh-pages`);
tryRun(`git worktree remove --force "${tmp}"`);

if (!tryRun('gh api -X POST repos/wolfool/fight-sim/pages -f "source[branch]=gh-pages" -f "source[path]=/"')) {
  tryRun('gh api -X PUT repos/wolfool/fight-sim/pages -f "source[branch]=gh-pages" -f "source[path]=/"');
}
console.log('배포 완료: https://wolfool.github.io/fight-sim/');
