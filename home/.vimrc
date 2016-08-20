set list
set listchars=tab:>-,trail:-

noremap j gj
noremap k gk
noremap gj j
noremap gk k

nnoremap <C-t>   gt
nnoremap <C-S-t> gT
nnoremap <C-n>   :n
"nnoremap <F1>   :NERDTree
nnoremap <F1>   :NERDTreeToggle<CR>

nnoremap gc `[v`]
vnoremap gc :<C-u>normal gc<Enter>
onoremap gc :<C-u>normal gc<Enter>

nnoremap <Space>.  :<C-u>edit $MYVIMRC<Enter>
nnoremap <Space>s. :<C-u>source $MYVIMRC<Enter>

command! Cp932      edit ++enc=cp932
command! Eucjp      edit ++enc=euc-jp
command! Iso2022jp  edit ++enc=iso-2022-jp
command! Utf8       edit ++enc=utf-8
command! Jis    Iso2022jp
command! Sjis   Cp932


let Grep_Path = '/bin/grep'
let Fgrep_Path = '/bin/fgrep'
let Egrep_Path = '/bin/egrep'
let Grep_Find_Path = '/usr/bin/find'
let Grep_Xargs_Path = '/usr/bin/xargs'
let Grep_Shell_Quote_Char = '"'

 " URL: http://vim.wikia.com/wiki/Example_vimrc
 " Authors: http://vim.wikia.com/wiki/Vim_on_Freenode
 " Description: A minimal, but feature rich, example .vimrc. If you are a
 "              newbie, basing your first .vimrc on this file is a good choice.
 "              If you're a more advanced user, building your own .vimrc based
 "              on this file is still a good idea.
 
 "------------------------------------------------------------
 " Features {{{1
 "
 " These options and commands enable some very useful features in Vim, that
 " no user should have to live without.
 
 " Set 'nocompatible' to ward off unexpected things that your distro might
 " have made, as well as sanely reset options when re-sourcing .vimrc
 " Vi互換モードをオフ（Vimの拡張機能を有効）
 set nocompatible

 
 " Attempt to determine the type of a file based on its name and possibly its
 " contents.  Use this to allow intelligent auto-indenting for each filetype,
 " and for plugins that are filetype specific.
 " ファイル名と内容によってファイルタイプを判別し、ファイルタイププラグインを有効にする
"  filetype indent plugin on
 filetype off
 
 " Enable syntax highlighting
 " 色づけをオン
 syntax on
 
 
 "------------------------------------------------------------
 " Must have options {{{1
 "
 " These are highly recommended options.
 " 強く推奨するオプション
 
 " One of the most important options to activate. Allows you to switch from an
 " unsaved buffer without saving it first. Also allows you to keep an undo
 " history for multiple files. Vim will complain if you try to quit without
 " saving, and swap files will keep you safe if your computer crashes.
 " バッファを保存しなくても他のバッファを表示できるようにする
 set hidden
 
 " Better command-line completion
 " コマンドライン補完を便利に
 set wildmenu
 
 " Show partial commands in the last line of the screen
 " タイプ途中のコマンドを画面最下行に表示
 set showcmd
 
 " Highlight searches (use <C-L> to temporarily turn off highlighting; see the
 " mapping of <C-L> below)
 " 検索語を強調表示（<C-L>を押すと現在の強調表示を解除する）
 set hlsearch
 
 " Modelines have historically been a source of security vulnerabilities.  As
 " such, it may be a good idea to disable them and use the securemodelines
 " script, <http://www.vim.org/scripts/script.php?script_id=1876>.
 " 歴史的にモードラインはセキュリティ上の脆弱性になっていたので、
 " オフにして代わりに上記のsecuremodelinesスクリプトを使うとよい。
 " set nomodeline
 
 
 "------------------------------------------------------------
 " Usability options {{{1
 "
 " These are options that users frequently set in their .vimrc. Some of them
 " change Vim's behaviour in ways which deviate from the true Vi way, but
 " which are considered to add usability. Which, if any, of these options to
 " use is very much a personal preference, but they are harmless.
 
 " Use case insensitive search, except when using capital letters
 " 検索時に大文字・小文字を区別しない。ただし、検索後に大文字小文字が
 " 混在しているときは区別する
 set ignorecase
 set smartcase
 
 " Allow backspacing over autoindent, line breaks and start of insert action
 " オートインデント、改行、インサートモード開始直後にバックスペースキーで
 " 削除できるようにする。
 set backspace=indent,eol,start
 
 " When opening a new line and no filetype-specific indenting is enabled, keep
 " the same indent as the line you're currently on. Useful for READMEs, etc.
 " オートインデント
 set autoindent
 
 " Stop certain movements from always going to the first character of a line.
 " While this behaviour deviates from that of Vi, it does what most users
 " coming from other editors would expect.
 " 移動コマンドを使ったとき、行頭に移動しない
 set nostartofline
 
 " Display the cursor position on the last line of the screen or in the status
 " line of a window
 " 画面最下行にルーラーを表示する
 set ruler
 
 " Always display the status line, even if only one window is displayed
 " ステータスラインを常に表示する
 set laststatus=2
 
 " Instead of failing a command because of unsaved changes, instead raise a
 " dialogue asking if you wish to save changed files.
 " バッファが変更されているとき、コマンドをエラーにするのでなく、保存する
 " かどうか確認を求める
 set confirm
 
 " Use visual bell instead of beeping when doing something wrong
 " ビープの代わりにビジュアルベル（画面フラッシュ）を使う
 set visualbell
 
 " And reset the terminal code for the visual bell.  If visualbell is set, and
 " this line is also included, vim will neither flash nor beep.  If visualbell
 " is unset, this does nothing.
 " そしてビジュアルベルも無効化する
 set t_vb=
 
 " Enable use of the mouse for all modes
 " 全モード､
" set mouse=a
 
 " Set the command window height to 2 lines, to avoid many cases of having to
 " "press <Enter> to continue"
 " コマンドラインの高さを2行に
 set cmdheight=2
 
 " Display line numbers on the left
 " 行番号を表示
 set number
 
 " Quickly time out on keycodes, but never time out on mappings
 " キーコードはすぐにタイムアウト。マッピングはタイムアウトしない
 set notimeout ttimeout ttimeoutlen=200
 
 " Use <F11> to toggle between 'paste' and 'nopaste'
 " <F11>キーで'paste'と'nopaste'を切り替える
 set pastetoggle=<F11>

 " カーソル行の強調表示
set cursorline 

 " ノーマルモードでもエンターキーで改行挿入
 noremap <CR> o <ESC>
 
 "------------------------------------------------------------
 " Indentation options {{{1
 " インデント関連のオプション {{{1
 "
 " Indentation settings according to personal preference.
 
 " Indentation settings for using 2 spaces instead of tabs.
 " Do not change 'tabstop' from its default value of 8 with this setup.
 " タブ文字の代わりにスペース2個を使う場合の設定。
 " この場合、'tabstop'はデフォルトの8から変えない。
 set shiftwidth=2
 set softtabstop=2
 set expandtab
 
 " Indentation settings for using hard tabs for indent. Display tabs as
 " two characters wide.
 " インデントにハードタブを使う場合の設定。
 " タブ文字を2文字分の幅で表示する。
 "set shiftwidth=2
 "set tabstop=2
 
 
 "------------------------------------------------------------
 " Mappings {{{1
 " マッピング
 "
 " Useful mappings
 
 " Map Y to act like D and C, i.e. to yank until EOL, rather than act as yy,
 " which is the default
 " Yの動作をDやCと同じにする
 map Y y$
 
 " Map <C-L> (redraw screen) to also turn off search highlighting until the
 " next search
 " <C-L>で検索後の強調表示を解除する
 nnoremap <C-L> :nohl<CR><C-L>
 
 
 "------------------------------------------------------------

" neocomplcache
let g:NeoComplCache_EnableAtStartup = 1
" 大文字小文字を区別する
let g:NeoComplCache_SmartCase = 1
" キャメルケース補完を有効にする
let g:NeoComplCache_EnableCamelCaseCompletion = 1
" アンダーバー補完を有効にする
let g:NeoComplCache_EnableUnderbarCompletion = 1
" シンタックスファイルの補完対象キーワードとする最小の長さ
let g:NeoComplCache_MinSyntaxLength = 3
" プラグイン毎の補完関数を呼び出す文字数
let g:NeoComplCache_PluginCompletionLength = {
  \ 'keyword_complete'  : 2,
  \ 'syntax_complete'   : 2
  \ }
" ファイルタイプ毎の辞書ファイルの場所
let g:NeoComplCache_DictionaryFileTypeLists = {
            \ 'default' : '',
            \ 'java' : $HOME.'/.vim/dict/j2se14.dict',
            \ 'javascript' : $HOME.'/.vim/dict/javascript.dict',
            \ 'php' : $HOME.'/.vim/dict/PHP.dict',
            \ }

" スニペットファイルの配置場所
let g:NeoComplCache_SnippetsDir = '~/.vim/snippets'
 
" TABでスニペットを展開
imap <expr><TAB> neocomplcache#plugin#snippets_complete#expandable() ? "\<Plug>(neocomplcache_snippets_expand)" : "\<TAB>"
smap <TAB> <Plug>(neocomplcache_snippets_expand)


" 単語の前後に"を挿入
:map <F2> bi"<Esc>ea"<Esc>

":set encoding=utf-8
":set fileencodings=ucs-bom,iso-2022-jp-3,iso-2022-jp,eucjp-ms,euc-jisx0213,euc-jp,sjis,cp932,utf-8
"
"
"set rtp+=~/.vim/bundle/vundle/
"call vundle#rc()
"Bundle 'gmarik/vundle'
"filetype plugin indent on

" Perlの文法チェック
" 方法1
"autocmd FileType perl,cgi :compiler perl
"autocmd BufWritePost * : : call PerlSyntaxCheck()
"function PerlSyntaxCheck()
" if &ft == "perl"
"   make
" endif
"endfunction

" 方法2
"Bundle 'scrooloose/syntastic'
