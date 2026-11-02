import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  Image, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from "react-native";

const STARTER_RECIPES = [
  { id:"1", name:"Classic Margherita Pizza", category:"Italian", image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900", prep:"25 min", servings:"2", calories:"285", difficulty:"Easy", ingredients:["Pizza dough","Tomato sauce","Mozzarella","Fresh basil","Olive oil"], instructions:["Preheat oven to 220°C.","Spread tomato sauce over the dough.","Add mozzarella and bake for 12–15 minutes.","Top with basil and olive oil before serving."] },
  { id:"2", name:"Vegetable Biryani", category:"Indian", image:"https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900", prep:"45 min", servings:"4", calories:"390", difficulty:"Medium", ingredients:["Basmati rice","Mixed vegetables","Onion","Yogurt","Biryani spices"], instructions:["Wash and soak rice for 20 minutes.","Cook onions and vegetables with spices.","Layer partially cooked rice over the vegetables.","Cover and cook on low heat until rice is tender."] },
  { id:"3", name:"Chicken Tacos", category:"Mexican", image:"https://images.unsplash.com/photo-1551508974-8c7b4a2f5e8f?w=900", prep:"30 min", servings:"3", calories:"320", difficulty:"Easy", ingredients:["Tortillas","Chicken breast","Lettuce","Tomato","Taco seasoning"], instructions:["Season and cook the chicken thoroughly.","Slice the chicken into strips.","Warm the tortillas.","Fill with chicken and vegetables."] },
  { id:"4", name:"Fresh Garden Salad", category:"Healthy", image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900", prep:"15 min", servings:"2", calories:"160", difficulty:"Easy", ingredients:["Lettuce","Cucumber","Tomatoes","Olive oil","Lemon juice"], instructions:["Wash and dry all vegetables.","Chop vegetables into bite-sized pieces.","Whisk olive oil with lemon juice.","Toss together and serve fresh."] },
  { id:"5", name:"Chocolate Brownies", category:"Desserts", image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900", prep:"40 min", servings:"8", calories:"240", difficulty:"Medium", ingredients:["Dark chocolate","Butter","Sugar","Eggs","Flour"], instructions:["Preheat oven to 180°C.","Melt chocolate and butter together.","Whisk in sugar and eggs, then fold in flour.","Bake for 22–25 minutes and cool before slicing."] },
  { id:"6", name:"Creamy Mushroom Pasta", category:"Italian", image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900", prep:"25 min", servings:"2", calories:"430", difficulty:"Easy", ingredients:["Pasta","Mushrooms","Cream","Garlic","Parmesan"], instructions:["Boil pasta until al dente.","Sauté garlic and mushrooms.","Add cream and simmer briefly.","Toss pasta in the sauce and finish with Parmesan."] },
  { id:"7", name:"Berry Breakfast Smoothie", category:"Breakfast", image:"https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900", prep:"5 min", servings:"1", calories:"210", difficulty:"Easy", ingredients:["Mixed berries","Banana","Yogurt","Milk","Honey"], instructions:["Add all ingredients to a blender.","Blend until smooth.","Pour into a glass and serve chilled."] },
  { id:"8", name:"Thai Vegetable Curry", category:"Asian", image:"https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=900", prep:"35 min", servings:"3", calories:"350", difficulty:"Medium", ingredients:["Coconut milk","Curry paste","Broccoli","Bell pepper","Tofu"], instructions:["Heat curry paste in a pan.","Add coconut milk and stir.","Add vegetables and tofu.","Simmer until vegetables are tender."] },
  { id:"9", name:"Lemon Garlic Salmon", category:"Seafood", image:"https://images.unsplash.com/photo-1469703904269-9e7c2f2e4c1d?w=900", prep:"20 min", servings:"2", calories:"410", difficulty:"Medium", ingredients:["Salmon fillets","Lemon","Garlic","Olive oil","Parsley"], instructions:["Preheat oven to 200°C.","Place salmon in a baking dish.","Add garlic, lemon and olive oil.","Bake for 12–15 minutes or until cooked through."] },
  { id:"10", name:"Fluffy Pancakes", category:"Breakfast", image:"https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900", prep:"20 min", servings:"3", calories:"260", difficulty:"Easy", ingredients:["Flour","Milk","Egg","Baking powder","Sugar"], instructions:["Mix dry ingredients in a bowl.","Whisk milk and egg separately.","Combine until just mixed.","Cook small portions on a lightly greased pan until golden on both sides."] }
];

const CATEGORIES = ["All","Indian","Italian","Mexican","Healthy","Desserts","Breakfast","Asian","Seafood","Snacks"];

export default function App() {
  const [recipes, setRecipes] = useState(STARTER_RECIPES);
  const [favorites, setFavorites] = useState([]);
  const [screen, setScreen] = useState("home");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({name:"",category:"Indian",image:"",prep:"20 min",servings:"2",calories:"250",difficulty:"Easy",ingredients:"",instructions:""});

  const visibleRecipes = useMemo(() => recipes.filter(r =>
    (category === "All" || r.category === category) &&
    (r.name.toLowerCase().includes(search.toLowerCase()))
  ), [recipes, category, search]);

  const openForm = (recipe=null) => {
    setEditingId(recipe?.id || null);
    setForm(recipe ? {...recipe, ingredients:recipe.ingredients.join("\n"), instructions:recipe.instructions.join("\n")} :
      {name:"",category:"Indian",image:"",prep:"20 min",servings:"2",calories:"250",difficulty:"Easy",ingredients:"",instructions:""});
    setScreen("form");
  };

  const saveRecipe = () => {
    if (!form.name.trim() || !form.ingredients.trim() || !form.instructions.trim()) {
      Alert.alert("Missing information", "Please enter the recipe name, ingredients and instructions.");
      return;
    }
    const item = {...form, id:editingId || String(Date.now()),
      image:form.image.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900",
      ingredients:form.ingredients.split("\n").map(x=>x.trim()).filter(Boolean),
      instructions:form.instructions.split("\n").map(x=>x.trim()).filter(Boolean)};
    setRecipes(old => editingId ? old.map(r=>r.id===editingId?item:r) : [item,...old]);
    setSelected(item); setScreen("detail");
  };

  const toggleFavorite = id => setFavorites(old => old.includes(id) ? old.filter(x=>x!==id) : [...old,id]);
  const deleteRecipe = id => Alert.alert("Delete recipe", "Are you sure you want to delete this recipe?", [
    {text:"Cancel",style:"cancel"},
    {text:"Delete",style:"destructive",onPress:()=>{setRecipes(old=>old.filter(r=>r.id!==id));setFavorites(old=>old.filter(x=>x!==id));setSelected(null);setScreen("mine");}}
  ]);

  const goBack = () => setScreen("home");

  const Header = ({title, back=true}) => <View style={styles.header}>
    {back && <TouchableOpacity onPress={goBack}><Text style={styles.back}>‹ Back</Text></TouchableOpacity>}
    <Text style={styles.headerTitle}>{title}</Text>
  </View>;

  const RecipeCard = ({item}) => <TouchableOpacity style={styles.card} onPress={()=>{setSelected(item);setScreen("detail");}}>
    <Image source={{uri:item.image}} style={styles.cardImage}/>
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.muted}>{item.category}  •  {item.prep}</Text>
      <Text style={styles.cardMeta}>★ {item.difficulty}  ·  {item.calories} kcal</Text>
    </View>
    <TouchableOpacity style={styles.heart} onPress={()=>toggleFavorite(item.id)}>
      <Text style={{fontSize:22,color:favorites.includes(item.id)?"#e84b69":"#9aa0aa"}}>{favorites.includes(item.id)?"♥":"♡"}</Text>
    </TouchableOpacity>
  </TouchableOpacity>;

  return <SafeAreaView style={styles.safe}>
    {screen==="home" && <>
      <View style={styles.hero}>
        <Text style={styles.brand}>FoodieHub 🍲</Text>
        <Text style={styles.heroTitle}>Find your next{"\n"}favourite recipe.</Text>
        <Text style={styles.heroSub}>Simple ideas. Delicious moments.</Text>
        <TextInput style={styles.search} placeholder="Search recipes..." placeholderTextColor="#9aa0aa" value={search} onChangeText={setSearch}/>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Explore Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:18}}>
          {CATEGORIES.map(c=><TouchableOpacity key={c} onPress={()=>setCategory(c)} style={[styles.chip,category===c&&styles.chipActive]}><Text style={[styles.chipText,category===c&&styles.chipTextActive]}>{c}</Text></TouchableOpacity>)}
        </ScrollView>
        <View style={styles.rowBetween}><Text style={styles.sectionTitle}>Popular Recipes</Text><Text style={styles.muted}>{visibleRecipes.length} recipes</Text></View>
        {visibleRecipes.map(item=><RecipeCard key={item.id} item={item}/>)}
        {visibleRecipes.length===0&&<Text style={styles.empty}>No recipes found. Try another search.</Text>}
      </ScrollView>
    </>}

    {screen==="detail" && selected && <>
      <Header title="Recipe Details"/>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{uri:selected.image}} style={styles.detailImage}/>
        <Text style={styles.detailTitle}>{selected.name}</Text>
        <Text style={styles.muted}>{selected.category}  •  {selected.difficulty}</Text>
        <View style={styles.stats}>
          {[["⏱",selected.prep],["🍽",selected.servings+" servings"],["🔥",selected.calories+" kcal"]].map((x,i)=><View style={styles.stat} key={i}><Text style={styles.statIcon}>{x[0]}</Text><Text style={styles.statText}>{x[1]}</Text></View>)}
        </View>
        <View style={styles.rowBetween}><Text style={styles.sectionTitle}>Ingredients</Text><TouchableOpacity onPress={()=>toggleFavorite(selected.id)}><Text style={styles.action}>{favorites.includes(selected.id)?"♥ Saved":"♡ Add to Favorites"}</Text></TouchableOpacity></View>
        {selected.ingredients.map((x,i)=><Text style={styles.listItem} key={i}>•  {x}</Text>)}
        <Text style={[styles.sectionTitle,{marginTop:22}]}>Step-by-step Instructions</Text>
        {selected.instructions.map((x,i)=><View style={styles.step} key={i}><Text style={styles.stepNo}>{i+1}</Text><Text style={styles.stepText}>{x}</Text></View>)}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={()=>openForm(selected)}><Text style={styles.primaryText}>Edit Recipe</Text></TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={()=>deleteRecipe(selected.id)}><Text style={styles.deleteText}>Delete</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </>}

    {screen==="form" && <>
      <Header title={editingId?"Edit Recipe":"Add New Recipe"}/>
      <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":undefined} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.fieldLabel}>Recipe name *</Text><TextInput style={styles.field} placeholder="e.g. Homemade Pasta" value={form.name} onChangeText={v=>setForm({...form,name:v})}/>
        <Text style={styles.fieldLabel}>Category</Text><TextInput style={styles.field} placeholder="Indian, Italian, Healthy..." value={form.category} onChangeText={v=>setForm({...form,category:v})}/>
        <Text style={styles.fieldLabel}>Image URL</Text><TextInput style={styles.field} placeholder="https://..." autoCapitalize="none" value={form.image} onChangeText={v=>setForm({...form,image:v})}/>
        <Text style={styles.fieldLabel}>Preparation time</Text><TextInput style={styles.field} placeholder="20 min" value={form.prep} onChangeText={v=>setForm({...form,prep:v})}/>
        <Text style={styles.fieldLabel}>Number of servings</Text><TextInput style={styles.field} placeholder="2" value={form.servings} onChangeText={v=>setForm({...form,servings:v})}/>
        <Text style={styles.fieldLabel}>Calories</Text><TextInput style={styles.field} placeholder="250" value={form.calories} onChangeText={v=>setForm({...form,calories:v})}/>
        <Text style={styles.fieldLabel}>Difficulty level</Text><TextInput style={styles.field} placeholder="Easy / Medium / Hard" value={form.difficulty} onChangeText={v=>setForm({...form,difficulty:v})}/>
        <Text style={styles.fieldLabel}>Ingredients (one per line) *</Text><TextInput style={[styles.field,styles.multiline]} multiline value={form.ingredients} onChangeText={v=>setForm({...form,ingredients:v})} placeholder={"2 tomatoes\n1 onion\n1 tbsp oil"}/>
        <Text style={styles.fieldLabel}>Step-by-step instructions (one per line) *</Text><TextInput style={[styles.field,styles.multiline]} multiline value={form.instructions} onChangeText={v=>setForm({...form,instructions:v})} placeholder={"Prepare ingredients\nCook until ready\nServe warm"}/>
        <TouchableOpacity style={styles.primaryButton} onPress={saveRecipe}><Text style={styles.primaryText}>Save Recipe</Text></TouchableOpacity>
      </ScrollView></KeyboardAvoidingView>
    </>}

    {screen==="favorites" && <>
      <Header title="My Favorites" back={false}/>
      <ScrollView contentContainerStyle={styles.content}>
        {recipes.filter(r=>favorites.includes(r.id)).map(item=><RecipeCard key={item.id} item={item}/>)}
        {favorites.length===0&&<Text style={styles.empty}>Your favourite recipes will appear here.</Text>}
      </ScrollView>
    </>}

    {screen==="mine" && <>
      <Header title="My Recipes" back={false}/>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.primaryButton} onPress={()=>openForm()}><Text style={styles.primaryText}>＋ Add New Recipe</Text></TouchableOpacity>
        {recipes.filter(r=>!STARTER_RECIPES.some(s=>s.id===r.id)).map(item=><RecipeCard key={item.id} item={item}/>)}
        <Text style={styles.muted}>Your saved recipes appear here. Starter recipes are available under Home.</Text>
      </ScrollView>
    </>}

    <View style={styles.tabBar}>
      {[["home","⌂","Home"],["favorites","♥","Favorites"],["mine","▤","My Food"]].map(([s,ic,label])=><TouchableOpacity key={s} style={styles.tab} onPress={()=>setScreen(s)}><Text style={[styles.tabIcon,screen===s&&styles.tabSelected]}>{ic}</Text><Text style={[styles.tabLabel,screen===s&&styles.tabSelected]}>{label}</Text></TouchableOpacity>)}
    </View>
  </SafeAreaView>;
}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#f7f7f4"},hero:{backgroundColor:"#173f35",paddingHorizontal:22,paddingTop:22,paddingBottom:24,borderBottomLeftRadius:26,borderBottomRightRadius:26},
 brand:{color:"#d9e9c5",fontSize:17,fontWeight:"800",letterSpacing:0.5},heroTitle:{color:"#fff",fontSize:32,fontWeight:"800",lineHeight:38,marginTop:22},heroSub:{color:"#d1ded7",fontSize:14,marginTop:8,marginBottom:18},
 search:{backgroundColor:"#fff",borderRadius:13,paddingHorizontal:15,paddingVertical:13,fontSize:15,color:"#202820"},
 content:{padding:18,paddingBottom:32},sectionTitle:{fontSize:19,fontWeight:"800",color:"#1d3028",marginBottom:13},rowBetween:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
 chip:{paddingVertical:9,paddingHorizontal:15,backgroundColor:"#e8ece6",borderRadius:20,marginRight:8},chipActive:{backgroundColor:"#173f35"},chipText:{color:"#405248",fontWeight:"600"},chipTextActive:{color:"#fff"},
 card:{backgroundColor:"#fff",borderRadius:17,marginBottom:13,overflow:"hidden",flexDirection:"row",alignItems:"center",padding:9,elevation:2},cardImage:{width:92,height:92,borderRadius:12,backgroundColor:"#e5e5e5"},cardBody:{flex:1,paddingHorizontal:12},cardTitle:{fontSize:15,fontWeight:"800",color:"#1d3028",marginBottom:5},muted:{fontSize:12,color:"#7c877f",marginBottom:5},cardMeta:{fontSize:12,color:"#56765e",fontWeight:"600"},heart:{padding:7},
 header:{paddingHorizontal:18,paddingVertical:15,backgroundColor:"#fff",borderBottomWidth:1,borderBottomColor:"#e9ece7"},back:{color:"#39715a",fontWeight:"700",fontSize:14,marginBottom:7},headerTitle:{fontSize:22,fontWeight:"800",color:"#1d3028"},
 detailImage:{width:"100%",height:220,borderRadius:18,backgroundColor:"#e5e5e5",marginBottom:17},detailTitle:{fontSize:26,fontWeight:"800",color:"#1d3028",marginBottom:5},stats:{flexDirection:"row",justifyContent:"space-between",backgroundColor:"#eaf0e8",borderRadius:14,padding:14,marginVertical:18},stat:{alignItems:"center",flex:1},statIcon:{fontSize:20,marginBottom:5},statText:{fontSize:12,fontWeight:"700",color:"#405248"},action:{color:"#39715a",fontWeight:"700",fontSize:13},listItem:{fontSize:15,color:"#405248",paddingVertical:7,lineHeight:22},step:{flexDirection:"row",marginBottom:13,alignItems:"flex-start"},stepNo:{backgroundColor:"#dce9dc",color:"#24553f",fontWeight:"800",overflow:"hidden",borderRadius:15,width:29,height:29,textAlign:"center",textAlignVertical:"center",paddingTop:5,marginRight:11},stepText:{flex:1,color:"#405248",fontSize:14,lineHeight:22},
 buttonRow:{flexDirection:"row",gap:10,marginTop:24},primaryButton:{backgroundColor:"#173f35",padding:15,borderRadius:13,alignItems:"center",marginTop:10,flex:1},primaryText:{color:"#fff",fontWeight:"800",fontSize:15},deleteButton:{backgroundColor:"#fae8e8",padding:15,borderRadius:13,alignItems:"center",marginTop:10,flex:1},deleteText:{color:"#b63838",fontWeight:"800"},
 fieldLabel:{fontWeight:"700",color:"#33483b",marginTop:13,marginBottom:7},field:{backgroundColor:"#fff",borderWidth:1,borderColor:"#dce3db",borderRadius:11,padding:13,fontSize:14,color:"#25352b"},multiline:{height:110,textAlignVertical:"top"},empty:{textAlign:"center",color:"#7c877f",padding:30,lineHeight:22},
 tabBar:{flexDirection:"row",backgroundColor:"#fff",borderTopWidth:1,borderTopColor:"#e7ebe5",paddingVertical:9,paddingBottom:12},tab:{flex:1,alignItems:"center"},tabIcon:{fontSize:21,color:"#87948a"},tabLabel:{fontSize:11,color:"#87948a",marginTop:3,fontWeight:"600"},tabSelected:{color:"#1b6045",fontWeight:"900"}
});
