Vue.component('star-rating', VueStarRating.default);
let app = new Vue({
    el: '#app',
    data: {
      number: '',
      max: '',
      current: {
        title: '',
        img: '',
        alt: ''
      },
      loading: true,
      addedName: '',
      addedComment: '',
      addedDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
      comments: {},
      ratings: {
        sum: '',
        total: '',
        average: ''
      },
    },
    created() {
      this.xkcd();
    },
    computed: {
        month() {
          var month = new Array;
          if (this.current.month === undefined)
            return '';
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";
          return month[this.current.month - 1];
        },
        averageRating() {
          if(!this.ratings[this.number]) {
            return 0;
          }
          average = this.ratings[this.number].sum / this.ratings[this.number].total;
          return average;
          /*
          //if (!(this.ratings[this.number])) //is that the right syntax? for number?
            this.ratings.average = 0; 
            this.ratings.sum = 0;
            this.ratings.total = 0;
            //maybe this gets called each time?
          //average = parseInt(this.ratings.sum) / parseInt(this.ratings.total);
          //console.log("sum: " +this.ratings[this.number].sum);
          //console.log("total: " + this.ratings[this.number].total);
          console.log("called averageRating"); //the averages are different for each page thoug, which is good
          this.ratings.average = this.ratings[this.number].sum / this.ratings[this.number].total;
          return average;
          */
        }
      },
    watch: {
        number(value, oldvalue) {
            if (oldvalue === '') {
                this.max = value;
            } else {
            this.xkcd();
            }
        },
    },
    methods: {
        async xkcd() {
            try {
              this.loading = true;
              let url = 'https://xkcd.now.sh/?comic=';
              if (this.number === '') {
                url += 'latest';
              } else {
                url += this.number;
              }
              const response = await axios.get(url);
              this.current = response.data;
              this.loading = false;
              this.number = response.data.num;
            } catch (error) {
                this.number = this.max;
                console.log(error);
            }
        },
        previousComic() {
            this.number = this.current.num - 1;
            if (this.number < 1)
              this.number = 1;
        },
        nextComic() {
            this.number = this.current.num + 1;
            if (this.number > this.max)
              this.number = this.max
        },
        firstComic() {
            this.number = 1;
        },
        lastComic() {
            this.number = this.max
        },
        getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        randomComic() {
            this.number = this.getRandom(1, this.max);
        },
        addComment() {
            if (!(this.number in this.comments))
              Vue.set(app.comments, this.number, new Array);
            this.comments[this.number].push({
              author: this.addedName,
              text: this.addedComment,
              date: this.addedDate
            });
            this.addedName = '';
            this.addedComment = '';
            this.addedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
        },
        setRating(rating){
          console.log(rating + "current rating");
          
            if (!(this.number in this.ratings))
            Vue.set(this.ratings, this.number, {
              sum: 0,
              total: 0,
              average: 0
            });
            this.ratings[this.number].sum += rating;
            this.ratings[this.number].total += 1;
            this.ratings[this.number].average = this.ratings[this.number].sum / this.ratings[this.number].total;
            console.log(this.ratings[this.number].sum, rating);
            console.log("AVERAGE " + this.ratings.average);
        },
    } 
  });