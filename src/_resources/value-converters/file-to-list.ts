export class FileListToArrayValueConverter {  
    toView(fileList) : Array<number> {
        let files: Array<number> = [];
        if (!fileList) {
            return files;
        }
        for(let i = 0; i < fileList.length; i++) {
            files.push(fileList.item(i));
        }
        return files;
    }
}