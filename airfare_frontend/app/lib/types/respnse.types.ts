interface City {
  id: number;
  name: string;
  imageUrl: string;
}

interface Connection {
  id: number;
  fromCity: string;
  toCity: string;
  airfare: number;
  duration: number;
}

interface ApiResponse {
  connections: Connection[];
  fromCityImage: string;
  toCityImage: string;
}

interface NoConnectionResponse {
  message: string;
}

interface FindConnectionProps {
  initialCities: City[];
  initialFromCity: string;
  initialToCity: string;
}

export type {
  City,
  Connection,
  ApiResponse,
  NoConnectionResponse,
  FindConnectionProps,
};
