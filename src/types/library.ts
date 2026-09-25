import { SystemId } from './systems';

export type LibraryCategory = SystemId | 'fundamentals';

export interface LibraryArticle {
  id: string;
  category: LibraryCategory;
  categoryName: string;
  title: string;
  subtitle: string;
  readTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  summary: string;
  sections: Array<{
    heading: string;
    body: string;
    keyPoints?: string[];
  }>;
  relatedSystems?: SystemId[];
}
