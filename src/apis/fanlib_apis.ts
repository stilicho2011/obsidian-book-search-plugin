
import { requestUrl } from 'obsidian';
import { Book } from '@models/book.model';

export class FanlibAPI {
  /**
   * Поиск книги по ISBN через FantLab API
   * @param isbn - ISBN книги
   * @returns массив книг (Book[])
   */
  static async searchByISBN(isbn: string): Promise<Book[]> {
    try {
      const url = `https://api.fantlab.ru/work?isbn=${encodeURIComponent(isbn)}`;
      const response = await requestUrl({ url, method: 'GET' });
      const data = response.json;

      if (!data || !data.work) return [];

      const work = data.work;

      const book: Book = {
        title: work.title || '',
        author: work.authors?.map((a: any) => a.name).join(', ') || '',
        isbn: work.isbn || isbn,
        coverUrl: work.cover?.url || '',
        description: work.description || '',
        publisher: work.publisher || '',
        year: work.year || '',
        localCoverImage: '',
      };

      return [book];
    } catch (err) {
      console.error('Fanlib search error:', err);
      return [];
    }
  }
}
