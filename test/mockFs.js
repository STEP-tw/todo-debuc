class MockFileSystem {
  constructor() {
    this.files={}
  }
  addFile(file,content) {
    this.files[file]=content;
  }
  existsSync(file) {
    return Object.keys(this.files).includes(file)
  }
  readFileSync(file,encoding) {
    if(!this.existsSync(file))
      throw new Error("file not found");
    return this.files[file];
  }
  appendFile(file,content){
    this.files[file]+=content;
  }
  writeFileSync(file,content){
    this.files[file]=content;
  }
}

module.exports=MockFileSystem;
