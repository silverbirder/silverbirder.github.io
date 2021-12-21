import fs from 'fs';

const json = JSON.parse(fs.readFileSync('./index.json', 'utf-8'));

json.items.map((i) => {
    const markdownFileName = `${i.name.replace(/\s/g, '_').replace(/\//g, '_').replace(/&/g, '_').replace(/'/g, '_')}.md`;
    const markdownText = `# Goods >> ${i.name}\n\n<img src="${i.image}" style="width: 200px"/>`;
    fs.writeFileSync(`./tmp/${markdownFileName}`, markdownText);
});