const fs = require('fs');
const axios = require('axios');
const{ OpenAI } = require ('openai');
const util = require('util');
const stream = require('stream');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const finished = util.promisify(stream.finished); // 用于等待流完成

async function uploadAttachmentsToOpenAI(message) {
    const attachments = message.attachments;
    if (!attachments || attachments.size === 0) {
        return [];
    }

    const files = await Promise.all(
        attachments.map(async (attachment) => {
            const response = await axios.get(attachment.url, { responseType: 'stream' });
            const path = `/tmp/${attachment.filename}`;
            const writer = fs.createWriteStream(path);

            response.data.pipe(writer);
            await finished(writer); // 等待文件写入完成

            return path;
        })
    );

    const fileIds = [];
    for (const file of files) {
        try {
            const openaiFile = await openai.files.create({
                file: fs.createReadStream(file),
                purpose: "assistants", // 确保这里的 purpose 值是正确的
            });
            fileIds.push(openaiFile.id);
            fs.unlinkSync(file); // 删除临时文件
        } catch (error) {
            console.error("Error uploading file to OpenAI: ", error);
        }
    }

    console.log("File IDs: ", fileIds);
    return fileIds;
}


module.exports = {uploadAttachmentsToOpenAI};
