<template>
 <div>
  <v-carousel hide-delimiters
  v-model="activeSlide"
  >
  <template v-slot:prev>
      <v-btn icon @click="onPrevClick">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </template>

    
    <template v-slot:next>
      <v-btn icon @click="onNextClick">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </template>
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="selected?'https://image.tmdb.org/t/p/w500'+movieSelected.poster_path:'https://image.tmdb.org/t/p/w500'+item.poster_path"
    >
    <div v-if="!isPlaying" class="rating-overlay">
        <v-rating
          v-model="ratingselected"
          color="yellow"
          dense
          size="32"
          background-color="grey"
          @click="verificaRating(selected?movieSelected:item)"
        ></v-rating>
      </div>
      <v-btn
      class="play-pause-button"
      icon
      @click="togglePlayPause(selected?movieSelected:item)"
    >
      <v-icon v-if="isPlaying">mdi-pause-circle</v-icon>
      <v-icon v-else>mdi-play-circle</v-icon>
    </v-btn>
    </v-carousel-item>
    
  </v-carousel>
  <v-sheet
    class="mx-auto"
    elevation="8"
    max-width="1050"
  >
    <v-slide-group
      v-model="model"
      class="pa-4"
      selected-class="bg-success"
      show-arrows
    >
      <v-slide-group-item
        v-for="(movie,n) in moviesList"
        :key="n"
        v-slot="{ isSelected, toggle, selectedClass }"
      >
        <v-card
          :class="['ma-4', selectedClass]"
          color="grey-lighten-1"
          height="200"
          width="200"
          @click="toggle;setarMovie(movie)"
          
        >
        
        <v-img
          :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          height="100%"
          width="100%"
          contain
        >
        <div class="d-flex fill-height align-center justify-center">
            <v-scale-transition>
              <v-icon
                v-if="isSelected"
                color="white"
                icon="mdi-close-circle-outline"
                size="48"
              ></v-icon>
            </v-scale-transition>
          </div>
        
        </v-img>
          
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="1050"
  >
      <v-card-title>
        Recomendados Baseado em suas escolhas
      </v-card-title>

      <v-sheet
    class="mx-auto"
    elevation="8"
    max-width="1050"
  >
    <v-slide-group
      v-model="model"
      class="pa-4"
      selected-class="bg-success"
      show-arrows
    >
      <v-slide-group-item
        v-for="(movie,n) in recomendedMovieList"
        :key="n"
        v-slot="{ isSelected, toggle, selectedClass }"
      >
        <v-card
          :class="['ma-4', selectedClass]"
          color="grey-lighten-1"
          height="200"
          width="200"
          @click="toggle;setarMovie(movie)"
          
        >
        
        <v-img
          :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          height="100%"
          width="100%"
          contain
        >
        <div class="d-flex fill-height align-center justify-center">
            <v-scale-transition>
              <v-icon
                v-if="isSelected"
                color="white"
                icon="mdi-close-circle-outline"
                size="48"
              ></v-icon>
            </v-scale-transition>
          </div>
        
        </v-img>
          
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
  </v-card>
  
  </div>
</template>
<script>
  export default {
    data () {
      return {
        model: null,
        isPlaying: false,
        ratingselected:0,
        items: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
        ratings:[],
        movieSelected:{},
        selected:false,
        moviesList:[],
        recomendedMovieList:[],
        activeSlide: 0,
      }
    },
    methods:{
    decodeJwt(token) {
          try{
 const parts = token.split('.');

            // Decode the base64Url encoded payload
            const payload = parts[1];
            const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            // Parse the decoded payload into a JSON object
            return JSON.parse(decodedPayload);
          }catch{
            return false
          }
            // Split the token into its components
           
          
        },
      verificaRating(item){
        
        let data_rating={
          'movie_id':item.id,
          'rating':this.ratingselected
        }
        console.log(data_rating)
        const token = this.getCookie('tokenApibiso');
        this.$http.post('/usuarios/avaliacoes',data_rating,{headers:{
            Authorization: `${token}`
         }}).then(res=>{
          console.log(res.data)
        }).catch(err=>{
          if(err.response.status==401){
          
            this.$router.push('/')
          }
        })
         
      },
      togglePlayPause(item) {
      this.isPlaying = !this.isPlaying;
      if(this.isPlaying && item.watched == false){
        let movieid={'movieid':item.id}
        const token = this.getCookie('tokenApibiso');
        this.$http.post('/usuarios/watchedmovies',movieid,{headers:{
            Authorization: `${token}`
         }}).then(res=>{
          console.log(res.data)
        }).catch(err=>{
          if(err.response.status==401){
          
            this.$router.push('/')
          }
        })
      }
    },
       onPrevClick() {
      this.verificarMudanca()
      
      this.activeSlide = this.activeSlide > 0 ? this.activeSlide - 1 : this.items.length - 1;
    },
    onNextClick() {
      this.verificarMudanca()
    
      this.activeSlide = this.activeSlide < this.items.length - 1 ? this.activeSlide + 1 : 0;
    },
        getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        console.log(parts)
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    },

    buscarMovies() {
        const token = this.getCookie('tokenApibiso'); 
        
        
        
         this.$http.get('/filmes',{headers:{
            Authorization: `${token}`
         }}).then(
            res=>{
                
                this.moviesList = res.data
                this.items=this.moviesList.slice(0,6)

            }
         ).catch(err=>{
            if(err.response.status==401){
              
            this.$router.push('/')
          }
         })
          let dadosjwt = this.decodeJwt(token)
          if(dadosjwt){
              let usuario_id = dadosjwt.id
                      this.$http.get(`/filmes/${usuario_id}/recomendacoes`,{headers:{
                          Authorization: `${token}`
                      }}).then(
                          res=>{
                              console.log(res.data)
                              this.recomendedMovieList = res.data
                              
                          }
                      ).catch(err=>{
                          if(err.response.status==401){
                            
                          this.$router.push('/')
                        }
                      })
          }
          

          
          

        },
        setarMovie(movie){
          this.selected= true
          this.movieSelected=movie
        },
        verificarMudanca(){
          
          this.selected=false
          
        }
    },
    mounted(){
        this.buscarMovies()
    }
  }
</script>

<style scoped>
.play-pause-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5); 
  color: white;
  z-index: 2; 
}
.rating-overlay {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
  padding: 10px;
  border-radius: 8px;
}
</style>