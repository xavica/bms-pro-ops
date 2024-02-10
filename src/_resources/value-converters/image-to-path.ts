export class ImageToPathValueConverter {  
    toView() : string{
        return window.location.pathname+window.location.search;
    }
}