let eventBus = new Vue();

Vue.component('list', {
    props: {
        note_data: {
            type: Object,
            default() {
                return {}
            }
        },
        idColumn: {
            type: Object,
            default() {
                return {}
            }
        },
        notes: {
            type: Array,
            default() {
                return {}
            }
        },
        about:{
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            taskTitle: null,
            task: [],
        }

    },
    methods: {
        delNote() {
            this.$emit('del_note')
        },
        column1Move() {
            this.$emit('column1_move')
        },
        column2Move() {
            this.$emit('column2_move')
        },
        column2MoveLeft() {
            this.$emit('column2_move_left')
        },
        addTask() {
            if (this.taskTitle) {
                this.note_data.tasks.push({
                    taskTitle: this.taskTitle,
                    completed: false,
                });
                this.taskTitle = null;
                this.updateCompletedNum();
                this.save();
            }
        },
        checkbox(id) {
            this.note_data.tasks[id].completed = !this.note_data.tasks[id].completed;
            this.updateCompletedNum();
            this.save();
        },
        updateCompletedNum() {
            let counterCompleted = 0;
            let counterNotCompleted = 0;
            for (let el of this.note_data.tasks) {
                if (el.completed) {
                    counterCompleted++;
                } else {
                    counterNotCompleted++;
                }
            }
            this.note_data.completedNum = (counterCompleted / (counterCompleted + counterNotCompleted)) * 100;

        },
        save() {
            if (this.idColumn === 1 && this.note_data.completedNum <= 50) localStorage.todo = JSON.stringify(this.notes);
            else if (this.idColumn === 3 && this.note_data.completedNum === 100) localStorage.todo3 = JSON.stringify(this.notes);
            else localStorage.todo2 = JSON.stringify(this.notes);
        }

    },
    template: `
    <div class="list" >
            <div class="note_title_block">
                <h2 class="note_title">{{note_data.noteTitle}}</h2>
                <button @click="delNote()">X</button>
            </div>
            <div class="tasks">
                <div v-for="(element, elementId) in note_data.tasks" :key="elementId" class="task">
                    <div class="set_task">
                        <h3 class="title_task">{{element.taskTitle}}</h3>
                        <input @click="checkbox(elementId),column1Move(),column2Move(),column2MoveLeft()" 
                               type="checkbox" 
                               v-model="element.completed" 
                               :class="{none: note_data.completedNum === 100, disabled: note_data.completedNum > 50 && element.completed && about.lengthColumn1 === 3}" >
                    </div>
                    
                    <div class="date" v-if="note_data.date">
                        <p>{{note_data.time}}</p>
                        <p>{{note_data.date}}</p>
                    </div>
                </div>
                <div class="add_task" :class="{none: note_data.tasks.length >= 5 || note_data.completedNum === 100}">                  
                    <div class="add_task_input">
                        <input required type="text" @keyup.enter="addTask(),column2MoveLeft()" v-model="taskTitle" placeholder="Задача">
                    </div>
                    <button @click="addTask(),column2MoveLeft()">Добавить</button>
            </div>
        </div>
    </div>

    `,
})


let app = new Vue({
    el: '#app',
    data: {
        column1: {
            notes: [],
            idColumn: 1
        },
        column2: {
            notes: [],
            idColumn: 2
        },
        column3: {
            notes: [],
            idColumn: 3
        },
        noteTitle: null,
        taskTitle1: null,
        taskTitle2: null,
        taskTitle3: null,
        completed: false,
        about:{
            signal: false,
            bufColumn: [],
            id: null,
            lengthColumn1: null
        },
    },
    computed: {},
    mounted() {
        if (localStorage.todo) {
            this.column1.notes = JSON.parse(localStorage.todo)
        }
        if (localStorage.todo2) {
            this.column2.notes = JSON.parse(localStorage.todo2)
        }
        if (localStorage.todo3) {
            this.column3.notes = JSON.parse(localStorage.todo3)
        }
        if (localStorage.about){
            this.about = JSON.parse(localStorage.about)
        }
    },
    methods: {
        createNote() {
            if (this.noteTitle && this.column1.notes.length < 3 && this.taskTitle1 && this.taskTitle2 && this.taskTitle3) {
                this.column1.notes.push({
                    noteTitle: this.noteTitle,
                    tasks: [
                        {
                            taskTitle: this.taskTitle1,
                            completed: this.completed
                        },
                        {
                            taskTitle: this.taskTitle2,
                            completed: this.completed
                        },
                        {
                            taskTitle: this.taskTitle3,
                            completed: this.completed
                        }
                    ],
                    completedNum: 0,
                    date: null,
                    time: null
                });
                this.noteTitle = null;
                this.taskTitle1 = null;
                this.taskTitle2 = null;
                this.taskTitle3 = null
                localStorage.todo = JSON.stringify(this.column1.notes);

            }
            this.length()
        },
        deleteNote1(id) {
            this.column1.notes.splice(id, 1);
            this.length()
            localStorage.todo = JSON.stringify(this.column1.notes);
        },
        deleteNote2(id) {
            this.column2.notes.splice(id, 1);
            this.about.signal = false
            this.moveColumn1(this.about.id)
            localStorage.about = JSON.stringify(this.about)
            localStorage.todo2 = JSON.stringify(this.column2.notes);
        },
        deleteNote3(id) {
            this.column3.notes.splice(id, 1);
            localStorage.todo3 = JSON.stringify(this.column3.notes);
        },
        moveColumn1(id) {
            if (this.column1.notes[id].completedNum > 50 && this.column2.notes.length <= 5) {
                if (this.column2.notes.length === 5) {
                    this.about.signal = true;
                    this.about.bufColumn.push(this.column1.notes[id])
                    this.about.id = id
                }
                else if(this.about.bufColumn[0] && this.column2.notes.length === 4){
                    this.column2.notes.push(this.about.bufColumn[0])
                    this.about.bufColumn.splice(0, 1)
                    this.column1.notes.splice(this.about.id, 1)
                }
                else {
                    this.column2.notes.push(this.column1.notes[id])
                    this.column1.notes.splice(id, 1)
                }
            }
            this.length()
            localStorage.todo = JSON.stringify(this.column1.notes);
            localStorage.todo2 = JSON.stringify(this.column2.notes);
            localStorage.about = JSON.stringify(this.about)
        },
        moveColumn2(id) {
            if (this.column2.notes[id].completedNum === 100) {
                this.timeAndData(id);
                this.column3.notes.push(this.column2.notes[id]);
                this.column2.notes.splice(id, 1);
                this.moveColumn1(this.about.id)
                this.about.signal = false
            }
            localStorage.todo2 = JSON.stringify(this.column2.notes);
            localStorage.todo3 = JSON.stringify(this.column3.notes);
            localStorage.about = JSON.stringify(this.about)
        },
        moveColumn2Left(id) {
            if (this.column2.notes[id].completedNum <= 50) {
                this.column1.notes.unshift(this.column2.notes[id]);
                this.column2.notes.splice(id, 1);
                this.moveColumn1(this.about.id)
            }
            this.length()
            localStorage.todo = JSON.stringify(this.column1.notes);
            localStorage.todo2 = JSON.stringify(this.column2.notes);
        },
        timeAndData(id) {
            let Data = new Date();
            this.column2.notes[id].time = Data.getHours() + ':' + Data.getMinutes();
            this.column2.notes[id].date = Data.getDate() + ':' + Data.getMonth() + ':' + Data.getFullYear();
        },
        length(){
            this.about.lengthColumn1 = this.column1.notes.length;
            localStorage.about = JSON.stringify(this.about)
        }
    },
})
