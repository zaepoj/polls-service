import { Migration } from '@mikro-orm/migrations';

export class Migration20220122222037 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "poll_answer_entity" ("id" varchar(255) not null, "option_id" varchar(255) not null, "poll_id" varchar(255) not null);');
    this.addSql('alter table "poll_answer_entity" add constraint "poll_answer_entity_pkey" primary key ("id");');

    this.addSql('alter table "poll_answer_entity" add constraint "poll_answer_entity_option_id_foreign" foreign key ("option_id") references "poll_option_entity" ("id") on update cascade;');
    this.addSql('alter table "poll_answer_entity" add constraint "poll_answer_entity_poll_id_foreign" foreign key ("poll_id") references "poll_entity" ("id") on update cascade;');
  }

}
