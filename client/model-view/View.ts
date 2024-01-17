/**
 * ※イメージ
 * ユーザーと直接やり取りする部分を司る。モデルからの値の表示の更新, モデルに対するユーザーからの入力の通知 を行う。
 * User <-> View-A <-> Model-A <-> Model-B <-> View-B <-> User
 */
interface IView<M> {
    /** モデルの値の表示を更新する */
    update(model: M): void;
    /** 入力を通知するリスナを登録 */
    addEventListener(name: string, handler: (e: Event) => unknown): void;
}