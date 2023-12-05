class CalorieTracker{
    constructor(){
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        
        this._meals=[];
        this._workouts=[];

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
        
    }
    // Public Methods
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewMeal(meal);
        this._render();
    }
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewWorkout(workout);
        this._render();
    }
    removeMeal(id){
        const index=this._meals.findIndex((meal)=> meal.id === id);
        if (index !== -1) {
            const meal=this._meals[index];
            this._totalCalories -= meal.calories;
            this._meals.splice(index,1);
            this._render();
        }
    }

    removeWorkout(id){
        const index=this._workouts.findIndex((workout)=> workout.id === id);
        if (index !== -1) {
            const workout=this._workouts[index];
            this._totalCalories += workout.calories;
            this._workouts.splice(index,1);
            this._render();
        }
    }

    reset(){
        this._totalCalories = 0;
        this._meals=[];
        this._workouts=[];
        this._render();
    }

    setLimit(calorieLimit){
        this._calorieLimit = calorieLimit;
        this._displayCaloriesLimit();
        this._render();
    }

    // Private Methods
    _displayCaloriesTotal(){
        const totalCaloriesEL= document.getElementById('calories-total');
        totalCaloriesEL.innerHTML=this._totalCalories;
    }

    _displayCaloriesLimit(){
        const calorieLimitEL= document.getElementById('calories-limit');
        calorieLimitEL.innerHTML=this._calorieLimit;
    }
    _displayCaloriesConsumed(){ 
        const caloriesConsumedEL= document.getElementById('calories-consumed');
        const consumed= this._meals.reduce((total,meal) => total+ meal.calories,0)
        caloriesConsumedEL.innerHTML=consumed;
    }
    _displayCaloriesBurned(){ 
        const caloriesBurnedEL= document.getElementById('calories-burned');
        const burned= this._workouts.reduce((total,workout) => total+ workout.calories,0)
        caloriesBurnedEL.innerHTML=burned;
    }

    _displayCaloriesRemaining(){
        const caloriesRemainingEL= document.getElementById('calories-remaining');
        const progressEL= document.getElementById('calorie-progress');
        const remaining= this._calorieLimit - this._totalCalories;
        caloriesRemainingEL.innerHTML=remaining;

        if(remaining <= 0){
            caloriesRemainingEL.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEL.parentElement.parentElement.classList.add('bg-danger');

            progressEL.classList.remove('bg-success');
            progressEL.classList.add('bg-danger');
        }else{
            caloriesRemainingEL.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEL.parentElement.parentElement.classList.add('bg-light');

            progressEL.classList.remove('bg-danger');
            progressEL.classList.add('bg-success');
        }

    }

    _displayCaloriesProgress(){
        const progressEL= document.getElementById('calorie-progress');
        const percentage=(this._totalCalories / this._calorieLimit) * 100;
        const width=Math.min(percentage,100);

        progressEL.style.width=`${width}%`;
    }

    _displayNewMeal(meal){
        const mealsEL= document.getElementById('meal-items');
        const mealEL=document.createElement('div');
        mealEL.classList.add('card', 'my-2');
        mealEL.setAttribute('data-id',meal.id);

        mealEL.innerHTML=`<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
        `;
        mealsEL.appendChild(mealEL);

    }
    _displayNewWorkout(workout){
        const workoutsEL= document.getElementById('workout-items');
        const workoutEL=document.createElement('div');
        workoutEL.classList.add('card', 'my-2');
        workoutEL.setAttribute('data-id',workout.id);

        workoutEL.innerHTML=`<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
        `;
        workoutsEL.appendChild(workoutEL);

    }

    _render(){
        this._displayCaloriesTotal(); 
        this._displayCaloriesConsumed(); 
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
    
}

class Meal{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class App{
    constructor(){
        this._tracker = new CalorieTracker();
        document
        .getElementById('meal-form')
        .addEventListener('submit', this._newItem.bind(this,'meal'));

        document.
        getElementById('workout-form').
        addEventListener('submit', this._newItem.bind(this,'workout'));

        document.getElementById('meal-items').
        addEventListener('click', this._removeItem.bind(this,'meal'));

        document.getElementById('workout-items').
        addEventListener('click', this._removeItem.bind(this,'workout'));

        document.getElementById('filter-meals').
        addEventListener('keyup', this._filterItems.bind(this,'meal'));

        document.getElementById('filter-workouts').
        addEventListener('keyup', this._filterItems.bind(this,'workout'));

        document.getElementById('reset').
        addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').
        addEventListener('submit', this._setLimit.bind(this));


    }
    _newItem(type,e){
        e.preventDefault();
        let name=document.getElementById(`${type}-name`).value;
        let calories=document.getElementById(`${type}-calories`).value;

        // validate inputs
        if(name.value==='' || calories.value==='' ){
            alert('Please enter a name and calories');
            return;
        }
        
        if (type==='meal') {
            const meal=new Meal(name,+calories);
            this._tracker.addMeal(meal);
        } else {
            const workout=new Workout(name,+calories);
            this._tracker.addWorkout(workout);
        }
        
        name='';
        calories='';

        const collapseItem=document.getElementById(`collapse-${type}`);
        const bsCollapse=new bootstrap.Collapse(collapseItem,{
            toggle:true
        }); 
    }
    _removeItem(type,e){
        if (e.target.classList.contains('delete')||e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure you want to delete ?')) {
                const id=e.target.closest('.card').getAttribute('data-id');
                type==='meal'
                ? this._tracker.removeMeal(id)
                : this._tracker.removeWorkout(id);
                e.target.closest('.card').remove();
            }
            
        }
    }

    _filterItems(type,e){
        const text=e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach(item=>
            {
                const name=item.firstElementChild.firstElementChild.textContent;
                if (name.toLowerCase().indexOf(text)!==-1) {
                    item.style.display='block'
                }else{
                    item.style.display='none'
                }
            }

        )
    }

    _reset(){
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML='';
        document.getElementById('workout-items').innerHTML='';
        document.getElementById('filter-meals').value='';
        document.getElementById('filter-workouts').value='';
    }

    _setLimit(e){
        e.preventDefault();
        const limit=document.getElementById('limit');
        if (limit.value=='') {
            alert('Please enter a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value='';

        const modalEl=document.getElementById('limit-modal');
        const modal=bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
    
}

const app= new App();