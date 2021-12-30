import sharp from 'sharp';
import fetch from 'node-fetch';
import fs from 'fs/promises'
import cbGlob from 'glob';
import {promisify} from 'util';
import * as Path from 'path';

const glob = promisify(cbGlob);


glob('./data/kings-of-war/*.json')
    .then(files => Promise.all([...files.map(f => fs.readFile(f, 'utf-8')
                                                    .then(json => [json, f]))]))
    .then(contents => contents.forEach(([json, file]) => {
        const data = JSON.parse(json)
        download(data.iconUrl, Path.parse(file).name)
    }));

function download(url, name) {
    fetch(url)
        .then(res => res.arrayBuffer())
        .then(blob => crop(blob, name))
        .then(console.log)
        .catch(console.error)
}

async function crop(blob, name) {
    const width = 240,
        r = width / 2,
        circleShape = Buffer.from(`<svg><circle cx="${r}" cy="${r}" r="${r}" /></svg>`);

    let region;

    // what?
    switch (name) {
        case 'ratkin':
            region = {left: 53, top: 58, width: 152, height: 152};
            break;
        case 'the-herd':
        case 'elves':
            region = {left: 68, top: 68, width: 152, height: 152};
            break;
        case 'ogres':
            region = {left: 70, top: 70, width: 152, height: 152};
            break;
        case 'forces-of-nature':
            region = {left: 70, top: 73, width: 152, height: 152};
            break;
        default:
            region = {left: 69, top: 69, width: 152, height: 152};
            break;
    }

    // noinspection JSSuspiciousNameCombination
    return sharp(Buffer.from(blob))
        .extract(region)
        .resize(width, width)
        .composite([{
            input: circleShape,
            blend: 'dest-in'
        }])
        .png()
        .toFile(`./public/images/icons/${name}.png`);
}
