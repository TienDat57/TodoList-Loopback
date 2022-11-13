import {TaskRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {ETaskStatus} from '../enums';
const cron = require('node-cron');

export class Cron {
   constructor(
      @repository(TaskRepository)
      public taskRepository: TaskRepository
   ) {
   }

   async start() {
      this.cleanTasks();
   }

   private async cleanTasks() {
      console.log('Start Cron Jobs');

      cron.schedule('* * * * * *', async () => {
         await this.cleanDoneTasks();
      });
   }

   private async cleanDoneTasks() {
      console.log('Start clean done tasks');
      const oneDay = 10000;
      const tasks = await this.taskRepository.find({
         where: {
            status: ETaskStatus.DONE
         }
      });
      if (tasks.length > 0) {
         tasks.forEach(async (task) => {
            if (task.doneTime) {
               const timeDifference = new Date().getTime() - task.doneTime.getTime();
               if (timeDifference > oneDay) {
                  await this.taskRepository.updateById(task.id, {
                     isDeleted: true
                  });
               }
            }
         });
      }
   }
}
