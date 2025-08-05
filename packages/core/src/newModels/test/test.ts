import Post from '@foscia/core/newModels/test/post';

const myPost = Post.make();

console.log(myPost.id);
console.log(myPost.publishedAt);
console.log(myPost.user);
console.log(myPost.$original.values.user);
console.log(myPost.$original.values.wrong);
console.log(myPost.myPlugins);

myPost.title = 'Hello World';
myPost.publishedAt = new Date();

const myOtherPost = new Post();
