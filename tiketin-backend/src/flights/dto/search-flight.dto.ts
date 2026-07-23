import { IsDateString, IsString, Length, Matches } from 'class-validator';

export class SearchFlightsDto {
  @IsString()
  @Length(3, 3, { message: 'Origin harus berupa kode IATA 3 huruf, contoh: CGK' })
  @Matches(/^[A-Za-z]{3}$/, { message: 'Origin hanya boleh berisi huruf' })
  origin: string;

  @IsString()
  @Length(3, 3, { message: 'Destination harus berupa kode IATA 3 huruf, contoh: DPS' })
  @Matches(/^[A-Za-z]{3}$/, { message: 'Destination hanya boleh berisi huruf' })
  destination: string;

  @IsDateString({}, { message: 'Date harus berformat YYYY-MM-DD' })
  date: string;
}