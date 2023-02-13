import { Local } from '@/utils/storage.js';

export const globalComponentSize = Local.get('themeConfigPrev')
	? Local.get('themeConfigPrev').globalComponentSize
	: '';
