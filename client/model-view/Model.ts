/**
 * ※イメージ
 * 扱う値を司る。View やほかの Model からの変更を受け取り、View やほかの Model に対して通知する
 * User <-> View-A <-> Model-A <-> Model-B <-> View-B <-> User
 */
export interface IModel {
    changeXX(xxValue: unknown): void;
    addEventListener<E extends Event>(EventType: { new(): E }, handler: (e: E) => unknown): void
}

class C {
    #a = 1;
    private constructor() {}
}

const MyC1: typeof C = C;
const MyC2: C = C;
const MyC3 = C;

class Class {}
class MyClass {}

// Type annotation for a variable:
const myInstance: Class = new MyClass();

// Type guard:
function isMyClass(obj: any): obj is Class {
  return obj instanceof MyClass;
}

// Type inference:

function createClassInstance<C extends typeof MyClass>(type: C): InstanceType<C> {
    return new type(); // Now type refers to a constructor
}

type T = Uppercase<"string">;
const val: T = "STRING";