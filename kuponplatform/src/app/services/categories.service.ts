import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

foodCategories = [
  { category: 'Pizzas',       img: 'pizza.jpg' },
  { category: 'Burgers',      img: 'burgers.jpg' },
  { category: 'Sushi',        img: 'sushi.jpg' },
  { category: 'Thai Food',    img: 'thai-food.jpg' },
  { category: 'Indian Food',  img: 'indian-food.jpg' },
  { category: 'Chinese Food', img: 'chinese-food.jpg' },
  { category: 'Italian Food', img: 'italian-food.jpg' },
  { category: 'Mexican Food', img: 'mexican-food.jpg' },
  { category: 'Soups',        img: 'soups.jpg' },
  { category: 'Salads',       img: 'salats.jpg' }
  ];
  

  constructor() { }
}
