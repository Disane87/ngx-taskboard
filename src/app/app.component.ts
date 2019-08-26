import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showcaseMode = true;

  public hGroupKey = 'status';
  public vGroupKey = 'name';

  public hGroupKeys = ['open', 'closed', 'working'];
  public vGroupKeys = [];

  public items: Array<object> = [
    {
      id: 0,
      subject: 'nulla',
      description: 'Ullamco officia anim ad laborum commodo incididunt. Aute occaecat sunt tempor pariatur irure cillum mollit fugiat eu magna. Eu aliqua eu non proident ex sint ut enim incididunt cillum sunt. Consequat incididunt eiusmod eiusmod exercitation qui veniam reprehenderit sint ad sunt cupidatat quis in. Mollit aliquip adipisicing amet exercitation sunt id ut dolor mollit nostrud nisi. Aliquip cupidatat excepteur voluptate nostrud amet consectetur dolor sit consequat dolor. Aliqua incididunt enim pariatur est duis commodo consequat cupidatat anim adipisicing.',
      name: 'Marco',
      status: 'open',
      color: '#d82bbd'
    },
    {
      id: 1,
      subject: 'cillum',
      description: 'Reprehenderit velit irure eu duis laboris adipisicing excepteur. Quis minim occaecat incididunt anim proident laborum occaecat consequat aliquip ullamco. Laborum eu culpa dolore enim fugiat veniam nulla voluptate adipisicing mollit. Labore ullamco adipisicing aliquip sint. Ipsum occaecat do aute mollit non. Deserunt dolore sunt consequat pariatur fugiat culpa sint mollit ex amet amet veniam.',
      name: 'Marco',
      status: 'closed',
      color: '#d55e6b'
    },
    {
      id: 2,
      subject: 'minim',
      description: 'Exercitation proident commodo reprehenderit veniam enim deserunt anim anim ad commodo sint nostrud occaecat aliqua. Laborum exercitation dolore aute ut velit dolor ea nisi amet proident incididunt voluptate qui magna. Ea ipsum incididunt laborum nulla officia. Eu cillum id cupidatat id cupidatat sint veniam ullamco nostrud.',
      name: 'Natalie',
      status: 'open',
      color: '#942abd'
    },
    {
      id: 3,
      subject: 'consectetur',
      description: 'Eiusmod excepteur velit veniam cupidatat. Anim anim eu exercitation cupidatat exercitation eiusmod mollit dolor adipisicing. Ullamco ad qui deserunt eiusmod deserunt veniam dolor magna. Labore mollit officia nulla reprehenderit cupidatat voluptate voluptate. Ex occaecat sit excepteur culpa fugiat est. Nostrud laboris occaecat officia ipsum consequat aliqua do minim Lorem adipisicing excepteur laborum veniam. Irure non amet fugiat veniam.',
      name: null,
      status: null,
      color: '#697d04'
    },
    {
      id: 4,
      subject: 'proident',
      description: 'Id ipsum duis dolore fugiat. Qui laboris esse veniam eu veniam tempor dolor. Ut ut dolore exercitation ut fugiat ut tempor.',
      name: 'Marco',
      status: 'working',
      color: '#a37f13'
    },
    {
      id: 5,
      subject: 'id',
      description: 'Sit quis officia nostrud officia exercitation ad occaecat. Minim ad laboris magna Lorem deserunt do non et aliquip aliquip sunt eu tempor. Nulla adipisicing in incididunt eiusmod est ut elit nisi occaecat in. Consequat voluptate ad irure do sint est laborum aute.',
      name: null,
      status: null,
      color: '#8b4966'
    },
    {
      id: 6,
      subject: 'incididunt',
      description: 'Veniam non pariatur magna sint sunt non pariatur sit officia culpa nostrud Lorem fugiat. Sit do duis velit irure aute culpa nulla incididunt eiusmod culpa. Lorem incididunt quis sit mollit. Officia incididunt nostrud Lorem duis sit veniam adipisicing dolore anim eiusmod. Voluptate amet laborum laborum excepteur. Aute mollit magna sint adipisicing Lorem amet cupidatat anim adipisicing. Ad ad veniam et veniam laboris exercitation sit sunt velit excepteur ea.',
      name: 'Malian',
      status: 'working',
      color: '#344f4'
    },
    {
      id: 7,
      subject: 'tempor',
      description: 'Cupidatat aliquip esse ut consequat anim deserunt anim. Consequat in veniam quis quis incididunt veniam ea fugiat cupidatat ex non eiusmod. Ipsum duis fugiat quis est. Eiusmod laboris voluptate ad nulla dolor sint adipisicing in exercitation nostrud amet laborum do sint.',
      name: 'Marco',
      status: 'closed',
      color: '#ba9867'
    },
    {
      id: 8,
      subject: 'deserunt',
      description: 'Ea consectetur magna laborum ad nulla. Ipsum ex magna irure elit fugiat cupidatat est. In enim ullamco officia ut id ullamco voluptate aute Lorem nulla tempor commodo incididunt labore. Labore ullamco aute minim culpa sunt cupidatat commodo irure nostrud aute excepteur. Laboris elit cupidatat irure proident eiusmod id. Eu est duis proident duis anim anim nulla voluptate cillum ex. Sunt reprehenderit occaecat nisi laborum aliqua aliquip cupidatat aliqua duis sunt occaecat velit.',
      name: 'Malian',
      status: 'closed',
      color: '#3dfa8f'
    },
    {
      id: 9,
      subject: 'magna',
      description: 'Elit amet culpa incididunt Lorem magna minim ad pariatur ut consequat. Pariatur consectetur aute laborum ullamco sit sint ex do deserunt ut magna consequat. Ex elit id ut fugiat aute sint aute deserunt nostrud excepteur excepteur consequat id dolore. Eiusmod excepteur do adipisicing nostrud ullamco esse do culpa esse excepteur.',
      name: 'Malian',
      status: 'closed',
      color: '#6bb3f5'
    },
    {
      id: 10,
      subject: 'do',
      description: 'Velit veniam enim cillum pariatur pariatur culpa do occaecat reprehenderit. Minim reprehenderit labore Lorem irure in aliquip eiusmod nostrud enim duis nisi laboris. Aliquip adipisicing ea ea nulla Lorem ipsum irure quis irure id consectetur do laborum.',
      name: 'Natalie',
      status: 'closed',
      color: '#1b60c4'
    },
    {
      id: 11,
      subject: 'in',
      description: 'Laborum Lorem est amet elit minim id velit voluptate velit reprehenderit consequat reprehenderit irure ut. Lorem labore quis voluptate proident et excepteur. Commodo ipsum qui adipisicing occaecat ex magna est proident cillum aliquip.',
      name: 'Natalie',
      status: 'closed',
      color: '#128d16'
    },
    {
      id: 12,
      subject: 'aliqua',
      description: 'Lorem sit minim excepteur excepteur elit. Culpa do sit ad exercitation id labore laboris aliqua irure dolor laboris id nulla. Laborum veniam consequat reprehenderit consectetur ullamco occaecat pariatur. Quis laborum consectetur aliqua fugiat labore et tempor quis velit cupidatat veniam voluptate. Et et mollit pariatur elit aliquip quis quis elit dolore officia anim Lorem et. Eiusmod elit amet ullamco reprehenderit commodo officia dolor irure cupidatat.',
      name: 'Malian',
      status: null,
      color: '#56a104'
    },
    {
      id: 13,
      subject: 'ullamco',
      description: 'Cupidatat non enim reprehenderit exercitation cupidatat qui dolor ullamco nostrud duis culpa adipisicing id. Aute eiusmod officia dolor aute commodo ullamco voluptate veniam irure adipisicing pariatur non ex proident. Minim ut est quis reprehenderit irure in do incididunt esse enim. Nulla velit cillum duis non eu aliqua ullamco culpa nulla minim nisi minim excepteur. Sunt incididunt cillum cillum ea tempor laboris aliqua laboris. Nostrud dolor non in enim culpa ut ad veniam eu. Fugiat laboris eu ad aliquip irure et ex ea ad ex labore nisi culpa do.',
      name: 'Natalie',
      status: 'open',
      color: '#711311'
    }
  ];
}
