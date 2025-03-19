import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>): Promise<void> {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.increment(
      { id: event.entity.post.id },
      'commentCount',
      1,
    );
  }

  async afterRemove(event: RemoveEvent<Comment>): Promise<void> {
    const postRepository = event.manager.getRepository(Post);
    const decrementCount = 1 + (event.entity?.children.length || 0);

    await postRepository.decrement(
      { id: event.entity?.post.id },
      'commentCount',
      decrementCount,
    );
  }
}
