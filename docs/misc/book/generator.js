import fs from 'fs';

const json = JSON.parse(fs.readFileSync('./index.json', 'utf-8'));

json.map((j) => {
    const markdownFileName = `${j.title.replace(/\s/g, '_').replace(/\//g, '_').replace(/&/g, '_').replace(/'/g, '_')}.md`;
    const markdownText = `# Book >> ${j.title}\n\n<img src="${j.cover}" style="width: 200px"/>`;
    fs.writeFileSync(`./tmp/${markdownFileName}`, markdownText);
});