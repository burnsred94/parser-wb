import * as path from "path";
import * as fs from "fs";

const link = path.join(__dirname, '../../public/Ad_Banner.png')
export const sourceImg = fs.createReadStream(link)


