// hello.cc
#include <node.h>
#include <iostream>


namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world").ToLocalChecked());
}

void parseInt32(const FunctionCallbackInfo<Value> &args) {
  // 借用用C++的类型转换
  auto value  = args[0];
  std::cout << "hello" << std::endl;
  args.GetReturnValue().Set(intvalue);
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
  NODE_SET_METHOD(exports, "parseInt32", parseInt32);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo