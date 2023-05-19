export class CreateScraperDto {
  id: string;
  name: string;
  price: number;
  location: string;
  category: string;
  description: string;
  url: string;
  image: string;
  platform: string;
  dateScraped: Date;
}
