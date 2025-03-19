import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { PostView } from '../entities/post-view.entity';
import { Post } from '../entities/post.entity';

@EventSubscriber()
export class PostViewSubscriber implements EntitySubscriberInterface<PostView> {
  listenTo() {
    return PostView;
  }

  async beforeInsert(event: InsertEvent<PostView>): Promise<void> {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.increment(
      { id: event.entity.post.id },
      'viewCount',
      1,
    );
  }
}
