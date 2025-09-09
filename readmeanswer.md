

1) What is the difference between var, let, and const?
উত্তর:
var পুরোনোভাবে ভ্যারিয়েবল ডিক্লেয়ার করার জন্য ব্যবহার হয় এবং এর function scope থাকে।
let ব্লক-স্কোপড ভ্যারিয়েবল, মান পরিবর্তন করা যায়।
const ও ব্লক-স্কোপড, তবে একবার মান সেট করলে পরে পরিবর্তন করা যায় না।





2) What is the difference between map(), forEach(), and filter()?
উত্তর:

forEach() শুধু প্রতিটি element এর উপর লুপ চালায়, কিছু রিটার্ন করে না।

map() প্রতিটি element কে প্রসেস করে নতুন একটি অ্যারে রিটার্ন করে।

filter() শর্ত অনুযায়ী element বাছাই করে নতুন অ্যারে রিটার্ন করে।





3) What are arrow functions in ES6?
উত্তর:
Arrow function হলো ES6 এ আসা নতুন ছোট আকারের ফাংশন লেখার সিনট্যাক্স। এখানে function কীওয়ার্ড লাগে না এবং this এর ব্যবহারে সুবিধা পাওয়া যায়।





4) How does destructuring assignment work in ES6?
উত্তর:
Destructuring assignment ব্যবহার করে অবজেক্ট বা অ্যারের ভ্যালু আলাদা আলাদা ভ্যারিয়েবল এ সহজে বের করে আনা যায়। যেমন:

const person = {name: "Alamin", age: 22};
const {name, age} = person;

এখানে name এবং age সরাসরি person অবজেক্ট থেকে পাওয়া যাবে।




5) Explain template literals in ES6. How are they different from string concatenation?
উত্তর:
Template literals হলো ব্যাকটিক (`) চিহ্ন দিয়ে লেখা স্ট্রিং যেখানে string এর মধ্যে ভ্যারিয়েবল বা expression সহজে বসানো যায় ${variable} সিনট্যাক্স ব্যবহার করে।
এটি সাধারণ string concatenation (+ দিয়ে জোড়া লাগানো) এর চেয়ে সহজ ও পরিষ্কার।