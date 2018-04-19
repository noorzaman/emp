echo '-- git pull'
git pull
echo '-- git pull done'
echo
echo '-- npm install'
npm install
echo '-- npm install done'
echo
echo '-- npm run build'
npm run build
echo '-- npm run build done'

echo '-- copying dist folder to server'
scp -i ~/.ssh/emp_droplet -r ./dist root@165.227.61.201:/var/www/html/Vue
echo '-- done'
