export class BlobToUrlValueConverter {  
    toView(blob : string) : string{
        return URL.createObjectURL(blob);
    }
}