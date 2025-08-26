use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn dummy() -> u8 {
    42
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dummy_returns_42() {
        assert_eq!(dummy(), 42);
    }
}
