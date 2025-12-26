import { requestUrl } from 'obsidian';
import { Book } from '@models/book.model';

export class FanlibAPI {
  /**
   * Поиск книги по ISBN через FantLab API
   * @param isbn - ISBN книги
   * @returns Promise<Book[]>
   */
  static async searchByISBN(isbn: string): Promise<Book[]> {
    try {
      // FantLab API. Используем ISBN
      const url = `https://api.fantlab.ru/work?isbn=${encodeURIComponent(isbn)}`;

      const response = await requestUrl({
        url,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = response.json;

      if (!data || !data.work) {
        console.warn('FantLab: Нет данных по ISBN', isbn);
        return [];
      }

      const work = data.work;

      // Преобразуем данные FantLab в модель Book
      const book: Book = {
        title: work.title || '',
        author: work.authors?.map((a: any) => a.name).join(', ') || '',
        isbn: work.isbn || isbn,
        coverUrl: work.cover?.url || '',
        description: work.description || '',
        publisher: work.publisher || '',
        year: work.year || '',
        localCoverImage: '', // будет заполнено плагином при скачивании
      };

      return [book];
    } catch (err) {
      console.error('FanlibAPI searchByISBN error:', err);
      return [];
    }
  }
}

