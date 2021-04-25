module.exports = {
  '*.{js,jsx,less,sass,scss,md,json,yml,html}': ['prettier --write', 'git add'],
  '*.ts?(x)': ['prettier --parser=typescript --write', 'git add'],
}
