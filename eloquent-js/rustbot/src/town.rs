use std::collections::HashMap;
use std::hash::Hash;


#[derive(Hash)]
pub struct Place {
    name: String,
    roads: Vec<Box<Place>>,
}

pub struct Parcel {
    place: &Place,
    address: &Place,
}

pub struct TownState {
    place: Place,
    parcels: Vec<Parcel>,
}

// impl Index
pub struct TownGraph {
    roads: HashMap<Place, Vec<Place>>,
}

