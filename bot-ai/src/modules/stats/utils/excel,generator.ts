
import { BadRequestException } from '@nestjs/common/exceptions';
import * as Excel from 'exceljs';

import * as tmp from 'tmp';

export class ExcelGenerator {

    async excelGenerate(json) {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Stats');

        console.log(json);
        
        worksheet.columns = [
            { header: 'Date', key: 'date' },
            { header: 'Start Bot', key:'start_bot' },
            { header: 'Our Channels Button', key: 'our_channels_button' },
            { header: 'Success Registration', key:'success_registration' },
            { header: "Support button" , key: "support_button"},
            { header: "Regenerate button", key: "regenerate_button" },
            { header: "Start generation button", key: "start_generation_button" },
            { header: "Track position button", key: "track_position_button" },
            { header: "Reviews or copyright", key: "reviews_or_copyright" },
        ];
       
        json.forEach(element => {
            worksheet.addRow({
                date: element.date,
                start_bot: element.start_bot,
                our_channels_button: element.our_channels_button,
                success_registration: element.success_registration,
                support_button: element.support_button,
                regenerate_button: element.regenerate_button,
                track_position_button: element.track_position_button,
                reviews_or_copyright: element.reviews_or_copyright,
                start_generation_button: element.start_generation_button,
            })
        })

        const File = await new Promise((resolve, reject) => {

            tmp.file({ detachDescriptor: true, prefix: 'stats', postfix: '.xlsx' ,mode: parseInt('0600', 8)}, async (err, file) => {
            if (err) {
                throw new BadRequestException(err);
            } else {
                workbook.xlsx.writeFile(file).then(_ => {
                    resolve(file);
                }).catch(err => {

                    throw new BadRequestException(err);
                })
            }
            })

        })
        

        return File;
        
        
    }
}