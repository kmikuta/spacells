use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn compute_sth(a: i32, b: i32) -> i32 {
    a + b
}
