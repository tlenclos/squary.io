ImagesCollection = new FS.Collection("images", {
    stores: [new FS.Store.GridFS("images")]
});

ImagesCollection.allow({
    download:function(){
        return true;
    }
});
