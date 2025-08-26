#[cfg(feature = "dummy")]
mod dummy;
#[cfg(feature = "reverse4bits")]
mod reverse4bits;

#[cfg(feature = "dummy")]
pub use dummy::dummy;
#[cfg(feature = "reverse4bits")]
pub use reverse4bits::reverse4bits;
